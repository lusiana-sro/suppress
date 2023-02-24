const express = require('express');
// import cors
const cors = require('cors');
const mongoose = require('mongoose');
const {EJSON} = require('bson');
const { Configuration, OpenAIApi } = require("openai");
const prompts = require('./prompts.js');
const cohere = require('cohere-ai');


const SuppressMiddleware = (req, res, next) => {
    next();
    // req.suppress must have the following keys
    // prompt, format, generator
        // check for keys
    if (req.suppress && req.suppress.prompt && req.suppress.format && req.suppress.generator) {
        req.generator = new DataGenerator(req.suppress.prompt, req.suppress.format, req.suppress.llm);
        let input = {};
        if (req.method === "POST") {
            input = req.body;

        } else {
            // GET
            input = req.query;
            // add params to input
            console.log(req.params);
            Object.keys(req.params).forEach((param) => {
                input[param] = req.params[param];
            });
        }
        req.generator.generate(input).then((output) => {
            res.send(output);
        }).catch((err) => {
            res.send(err);
        });
    }
}



class SuppressModel {
    constructor() {
    }

    stringReturnHandler(str) {
        // some strings will come back with a trailing ' or ` at the start and end
        // this function removes those
        return str.replace(/['`]/g, '');
    }
    async generate (data) {
        throw new Error('You have to implement the method generate!');
    }


    beIrresnponsible () {
        this.irresponsible = true;
        return this;
    }

    setPreviousModel (previousModel) {
        this.previousModel = previousModel;
    }

    responsibleResponse(output) {
        return {
            "response": output,
            "about": this.about
        };
    }

    adjust(key, value) {
        this[key] = value;
        return this;
    }
}

class OpenAILLM extends SuppressModel {
    /*
     * @param apiKey: the OpenAI API key
     */
    constructor (apiKey) {
        super();
        this.apiKey = apiKey;
        this.config = new Configuration({
            apiKey: this.apiKey
        });
        this.api = new OpenAIApi(this.config);
        this.about = {
            model: "OpenAI GPT-3",
            omniID: "text-davinci-003"
        };
        this.parseJson = true;
    }

    setModel(model) {
        this.about.omniID = model;
        return this;
    }

    async generate(prompt) {
        return await this.api.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: this.max_tokens || 700,
            temperature: this.temperature || 0.7
        }).then((data) => {
            data = data.data.choices[0].text;
            let res = this.stringReturnHandler(data);
            // try parse teh response as JSON
            // check if should parese json
            if (this.parseJson) {
                try {
                    res = EJSON.parse(res);
                } catch (e) {
                    // do nothing
                }
            }
            // check if should be irresponsible
            if(this.irresponsible) {
                return res;
            } else {
                return this.responsibleResponse(res);
            }

        }).catch((error) => {
            console.error(error);
            throw error;
        });
    }
}



class CohereAILLM extends SuppressModel {
    constructor(options) {
        super();
        this.task = options.task;
        this.cohere = cohere;
        this.cohere.init(options.apiKey);
        this.parseJson = true;
    }

    async runTask(task, input) {
        // we can have tasks such as
        // generate, summarize, classify
        // each has a different input and output and method
        // so we need to handle each one differently
        switch (task) {
            case 'generate':
                return await this.cohere.generate({prompt:input, model: this.model && "medium"}).
                then((response) => {
                    response = response.body.generations[0].text;
                    return response;
                });
            case 'summarize':
                return await this.cohere.summarize({...input, model: this.model && "summarize-medium"}).
                then((response) => {
                    response = response.body.summary;
                    return response;
                });
            case 'classify':
                throw new Error('classify not implemented');
                return await this.cohere.classify({...input, model: this.model && "small"});
            default:
                throw new Error(`Unknown task ${task}`);
        }
    }

    async generate(prompt) {
        return await this.runTask(this.task, prompt).then((response) => {
            console.log(response);
            let res = this.stringReturnHandler(response);

            if (this.parseJson) {
                try {
                    res = EJSON.parse(res);
                } catch (e) {
                    // do nothing
                }
            }
            // check if should be irresponsible
            if(this.irresponsible) {
                return res;
            } else {
                return this.responsibleResponse(res);
            }
        });
    }

}

/*
  This class is used to store data in a mongodb database
*/
class DataStorage {

    /*
     * Constructor for the DataStorage class
     * @param {string} databaseName - The name of the database to connect to
     * @param {string} apiKey - OpenAI API key
     */
    constructor (databaseName, apiKey) {
        // connect to a mongodb database by name and save the connection to this.db
        this.dbname = databaseName;
        this.llm = new OpenAILLM(apiKey).beIrresnponsible().adjust('parseJson', false);
    }


    /*
      This function is used to connect to the database
    */
    async connect() {
        // connect to the database
        await mongoose.connect(`mongodb://localhost:27017/${this.dbname}`, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'connection error:'));
        await this.db.once('open', function() {
            console.log("Connected to database");
            this.db = this.db.db;
            return this.db;
        });
    }


    /*
      This function is used to decide which collection to use for a given task
      @param {object} data - The data to be stored
      @param {string} task - The task to be performed
      @param {array} collections - The collections to choose from
    */
    async collectionDecision(data, task, collections) {
        // simulated response of a promise. This should just returh 'todoItems'
        let prompt = prompts.database.add.collectionChoice(data, task, collections);
        return await this.llm.generate(prompt).then((data) => {
            // trim the string
            data = data.trim();
            console.log(data);
            return data;
        });

    }

    /*
      This function is used to add data to the database
      @param {object} data - The data to be stored
      @param {string} task - The task to be performed aka the request url
    */
    async add(data, task) {

        // check the database collections for a collection with the same structure
        // if it exists, add the data to it
        // if it doesn't exist, create a new collection with the same structure
        // and add the data to it
        // get all collections in database
        const collections = await this.db.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        // TODO we could create a separate collection to keep track of the fileds of the data we are storing
        console.log(collectionNames);
        return await this.collectionDecision(data, task, collectionNames).then(async (collectionName) => {
            // trim and lowercase the collection name
            collectionName = collectionName.trim().toLowerCase();
            // check if the collection name exists in the database
            if (collectionNames.includes(collectionName)) {
                console.log("Collection exists");
                // add the data to the collection
                return await this.db.collection(collectionName).insertOne(data);
            } else {
                // create the collection
                console.log("Collection doesn't exist");
                await this.db.createCollection(collectionName);
                // add the data to the collection
                return await this.db.collection(collectionName).insertOne(data);
            }
        });
    }

    /*
      This function is used to get data from the database
      @param {string} path - The path to the get the data
    */
    async get(path) {
        console.log("Processing: " + path);
        const collections = await this.db.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        let prompt1 = prompts.database.get.collectionChoice(path, collectionNames);
        return await this.llm.generate(prompt1).then(async (collectionName) => {
            collectionName = collectionName.trim().toLowerCase();
            console.log("Collection name: " + collectionName);
            return await this.db.collection(collectionName).findOne().then(async (data) => {
                data = Object.keys(data);
                let prompt2 = prompts.database.get.query(path, data);
                return await this.llm.generate(prompt2).then(async (query) => {
                    console.log("Query: " + query);
                    query = JSON.parse(query.trim());
                    return await new Promise((resolve, reject) => {
                        this.db.collection(collectionName).find(query).toArray(function(err, result) {
                            if (err) reject(err);
                            resolve(result);
                        });
                    });
                });
            });
        });
    }

    /*
      This function is used to update data in the database
      @param {object} data - The data which should replace the old data
      @param {string} path - The path of the URL to update the data
    */
    async update(data, path) {
        // the code is redundant and non modular relative to get, but it works
        let toUpdate = data;
        console.log("Processing: " + path);
        const collections = await this.db.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        let prompt1 = prompts.database.put.collectionChoice(path, collectionNames);
        return await this.llm.generate(prompt1).then(async (collectionName) => {
            collectionName = collectionName.trim();
            collectionName = collectionName.toLowerCase();
            console.log("Collection name: ", collectionName);
            return await this.db.collection(collectionName).findOne().then(async (data) => {
                let keys = Object.keys(data);
                keys = keys.filter((value) => {
                    return !value.startsWith("_");
                });
                let prompt2 = prompts.database.put.filter(path, toUpdate, keys);
                return await this.llm.generate(prompt2).then(async (filter) => {
                    let prompt3 = prompts.database.put.update(path, toUpdate, keys);
                    return await this.llm.generate(prompt3).then(async (update) => {
                        // now use the filter and update to update the database
                        filter = EJSON.parse(filter.trim());
                        console.log("Filter: ", filter);
                        // check if the update statement is correct, use the llm
                        let prompt4 = prompts.database.put.atomicCheck(update);
                        return await this.llm.generate(prompt4).then(async (updateC) => {
                            updateC = updateC.trim();
                            let isCorrect = updateC.toLowerCase() === "true";
                            update = isCorrect ? update : updateC;
                            update = EJSON.parse(update);
                            console.log("Update: ", update);
                            // update the mongodb database
                            return await this.db.collection(collectionName).updateOne(filter, update).then((data) => {
                                console.log("Updated: ", data);
                                return data;
                            });
                        });
                    });
                });
            });
        });
    }
}




class DataGenerator {

    /*
      This function is used to generate data based on the prompt and format
      @param {string} prompt - The prompt to generate the data
      @param {string} format - The format of the data to be generated
      @param {object} llm - The language model to use to generate the data
    */
    constructor(prompt, format, llm) {
        this.prompt = prompt;
        // check if the format is a json object
        if (typeof format === 'object') {
            this.format = JSON.stringify(format);
        } else {
            this.format = format;
        }
        console.log(this.format);
        this.llm = llm;
        this.log1 = true;
        this.parseJson = true;
        this.doFormat = true;
    }

    /*
        This function is used to set the value of a key in the class
        @param {object} change - The object containing the key and value to be changed
    */
    set(change) {
        for (let key in change) {
            this[key] = change[key];
        }
        return this;
    }

    /*
      This function is used to check if a string is a json object
      @param {string} str - The string to check
    */
    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /*
      This function is used to format the output of the data
      @param {object} data - The data to format
    */
    async formatOutput(data) {
        console.log("Will format output", this.format);
        if (this.doFormat) {
            data = data.response;
            let prompt = `${data}\nuse the above data and structure it acording to the following format:\n${this.format}\nStructured data:\n`;

            return await this.llm.generate(prompt).then((output) => {
                console.log("Output: ", output);
                return this.parseJson ? (this.isJson(output) ? JSON.parse(output) : output) : output;
            });
        } else {
            return data;
        }
    }

    set(change) {
        for (let key in change) {
            this[key] = change[key];
        }
        return this;
    }
    /*
      This function is used to generate data
      @param {object} data - The data which gets passed to the prompt to generate the data
    */
    async generate(data) {
        let tempPrompt = this.prompt;
        // data is a json, in the tempPrompt, replace the keys with the values
        for (let key in data) {
            tempPrompt = tempPrompt.replace(`{${key}}`, data[key]);
        }
        return await this.llm.generate(tempPrompt).then(async (data) => {
            return await this.formatOutput(data).then((data) => {
                return data;
            });
        }).catch((error) => {
            console.error(error.message);
            return error;
        });
    }
}

class SuppresServer {

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
    }

    beforeReturn (result) {
        return result;
    }
    /*
      This function is used to mount the database to the server
      @param {DataStorage} dataStorage - The database to mount
    */
    async mountDatabase(dataStorage) {
        dataStorage.connect().then(() => {
            this.createEndpoint(/api\/db/,"GET-db",dataStorage);
            this.createEndpoint(/api\/db/,"POST-db",dataStorage);
            this.createEndpoint(/api\/db/,"PUT-db",dataStorage);
        });
    }

    /*
      This function is used to create an endpoint for the server
      @param {string} path - The path of the endpoint
      @param {string} method - The method of the endpoint (GET, GET-db, POST, POST-db, PUT-db)
      @param {DataGenerator} generator - The generator to use to generate the data
    */
    createEndpoint(path, method, generator) {
        // based on the method
        switch (method) {
            case "GET":
                this.app.get(path, (req, res) => {
                    // get the link parameters
                    try {
                        const params = Object.assign({}, req.params, req.query);
                        generator.generate(req.params).then((gen)=>{
                            console.log("gen", gen);
                            this.beforeReturn(gen);
                            res.send(gen);
                        });
                    } catch (e) {
                        res.send(e);
                    }
                });
                break;
            case "GET-db":
                this.app.get(path, async (req, res) => {
                    let rpath = req.originalUrl;
                    try {
                        await generator.get(rpath).then((data) => {
                            this.beforeReturn(data);
                            res.send(data);
                            return;
                        });
                    } catch(e) {
                        res.send(e);
                    }
                });
                break;

            case "POST-db":
                this.app.post(path, async (req, res) => {
                    let rpath = req.originalUrl;
                    try {
                        await generator.add(req.body, rpath).then((data) => {
                            this.beforeReturn(data);
                            res.send(data);
                            return;
                        });
                    } catch (e) {
                        res.send(e);
                    }
                });
                break;
            case "POST":
                this.app.post(path, (req, res) => {
                    console.log(req.body);
                    generator.generate(req.body).then((gen) => {
                        console.log("gen", gen);
                        this.beforeReturn(gen);
                        res.send(gen);
                    });
                });
                break;
            case "PUT-db":
                this.app.put(path, async (req, res) => {
                    let rpath = req.originalUrl;
                    try {
                        await generator.update(req.body, rpath).then((data) => {
                            this.beforeReturn(data);
                            res.send(data);
                            return;
                        });
                    } catch (e) {
                        res.send(e);
                    }
                });
                break;
            default:
                console.error("Invalid method");
                break;
        }

    }

    /*
      This function is used to start the server
      @param {number} port - The port to start the server on
    */
    start(port) {
        port = port || 3000;
        this.app.listen(port, () => {
            console.log("Server started on port", port);
        });
    }
}


class SuppressSequence {

    constructor() {
        this.sequence = [];
    }

    add(component) {
        this.sequence.push(component);
        return this;
    }

    async generate(input) {
        let output = input;
        for (let i = 0; i < this.sequence.length; i++) {
            output = await this.sequence[i].generate(output);
        }
        return output;
    }
}

// export all classes

module.exports = { OpenAILLM, DataGenerator, SuppresServer, DataStorage, SuppressSequence, SuppressModel, SuppressMiddleware, CohereAILLM };
