const express = require('express');
const mongoose = require('mongoose');
const {EJSON} = require('bson');
const { Configuration, OpenAIApi } = require("openai");



class SuppressLLM {
    constructor (apiKey) {
        this.apiKey = apiKey;
        this.config = new Configuration({
            apiKey: this.apiKey
        });
        this.api = new OpenAIApi(this.config);
    }

    async generate(prompt) {
        return await this.api.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: this.max_tokens || 200,
            temperature: this.temperature || 0.7
        }).then((data) => {
            data = data.data.choices[0].text;
            return data;
        }).catch((error) => {
            console.error(error);
            return error;
        });
    }
}

class DataStorage {
    constructor (databaseName, apiKey) {
        // connect to a mongodb database by name and save the connection to this.db
        this.dbname = databaseName;
        this.llm = new SuppressLLM(apiKey);
    }

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


    async collectionDecision(data, task, collections) {
        // simulated response of a promise. This should just returh 'todoItems'
        let prompt = `${data}\nWhich of the following collections should the above data go into? Given that the data was sent under the path "${task}". If none of the collections fit, create a name for the collection which should hold the above data.\n${JSON.stringify(collections)}\nResult:`;
        return await this.llm.generate(prompt).then((data) => {
            // trim the string
            data = data.trim();
            console.log(data);
            return data;
        });

    }

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

    async get(path) {
        console.log("Processing: " + path);
        const collections = await this.db.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        let prompt1 = `${path}\nGiven the above request, select one of the following collections, from which to return the data:\n${JSON.stringify(collectionNames)}\nResult:`;
        return await this.llm.generate(prompt1).then(async (collectionName) => {
            collectionName = collectionName.trim().toLowerCase();
            console.log("Collection name: " + collectionName);
            return await this.db.collection(collectionName).findOne().then(async (data) => {
                data = Object.keys(data);
                // remove all values that start with _
                data = data.filter((value) => {
                    return !value.startsWith("_");
                });
                let prompt2 = `${path}\nGiven the above request, create a mongo-db query JSON if you know that there exist the following fields.\n${JSON.stringify(data)}\nQuery using the minimal number of query parameters:`;
                return await this.llm.generate(prompt2).then(async (query) => {
                    query = JSON.parse(query);
                    console.log("Query: ", query);
                    // find.then()
                    return await this.db.collection(collectionName).findOne(query).then((data) => {
                        console.log("Data: ", data);
                        return data;
                    });
                });
            });
        });
    }

    async update(data, path) {
        // the code is redundant and non modular relative to get, but it works
        let toUpdate = data;
        console.log("Processing: " + path);
        const collections = await this.db.db.listCollections().toArray();
        const collectionNames = collections.map(collection => collection.name);
        let prompt1 = `${path}\nGiven the above request, select one of the following collections, from which to return the data:\n${JSON.stringify(collectionNames)}\nResult:`;
        return await this.llm.generate(prompt1).then(async (collectionName) => {
            collectionName = collectionName.trim();
            collectionName = collectionName.toLowerCase();
            console.log("Collection name: " + collectionName);
            return await this.db.collection(collectionName).findOne().then(async (data) => {
                data = Object.keys(data);
                // remove all values that start with _
                data = data.filter((value) => {
                    return !value.startsWith("_");
                });
                let prompt2 = `${path}\nData to update:${JSON.stringify(toUpdate)}\nGiven the above request, create a JSON for mongo-db if you know that there exist the following fields.\n${JSON.stringify(data)}\nQuery using the minimal number of parameters:`;
                return await this.llm.generate(prompt2).then(async (query) => {
                    // the query contains atmoic update operators like $set, the query is a stringified JSON
                    // JSON.parse(query) will not work
                    // alternatively, we can use: https://www.npmjs.com/package/mongo-querystring
                    // neither will that, I trid EJSON but that didn't work either
                    // for now we just extract the values
                    query = EJSON.parse(query);
                    // get $set from query and remove it at the same time
                    let dataU = {$set: query.$set};
                    delete query.$set;
                    let filter = query;
                    console.log("Data: ", dataU);
                    console.log("Filter: ", filter);
                    // now we update the record with the new data
                    return await this.db.collection(collectionName).updateOne(query, dataU).then((data) => {
                        console.log("Data: ", data);
                        return data;
                    });
                });
            });
        });
    }

}



class DataGenerator {
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
    }

    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    async formatOutput(data) {
        let prompt = `${data}\nuse the above data and structure it acording to the following format:\n${this.format}\nStructured data:\n`;
        return await this.llm.generate(prompt).then((output) => {
            return this.parseJson ? (this.isJson(output) ? JSON.parse(output) : output) : output;
        });
    }

    async generateData(data) {
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
        this.app.use(express.urlencoded({ extended: true }));
    }

    async mountDatabase(dataStorage) {
        dataStorage.connect().then(() => {
            this..createEndpoint(/api\/db/,"GET-db",dataStorage);
            this..createEndpoint(/api\/db/,"POST-db",dataStorage);
            this..createEndpoint(/api\/db/,"PUT-db",dataStorage);
        })
    }

    createEndpoint(path, method, generator) {
        // based on the method
        switch (method) {
            case "GET":
                this.app.get(path, (req, res) => {
                    // get the link parameters
                    console.log(req.params)
                    generator.generateData(req.params).then((gen)=>{
                        console.log("gen", gen);
                        res.send(gen);
                    });
                });
                break;
            case "GET-query":
                this.app.get(path, (req, res) => {
                    // get the link parameters
                    console.log(req.query)
                    generator.generateData(req.query).then((gen)=>{
                        console.log("gen", gen);
                        res.send(gen);
                    });
                });
                break;
            case "GET-db":
                this.app.get(path, async (req, res) => {
                    let rpath = req.originalUrl;
                    await generator.get(rpath).then((data) => {
                        res.send(data);
                        return;
                    });
                });
                break;

            case "POST-db":
                this.app.post(path, async (req, res) => {
                    let rpath = req.originalUrl;
                    await generator.add(req.body, rpath).then((data) => {
                        res.send(data);
                        return;
                    });
                });
                break;
            case "POST":
                this.app.post(path, (req, res) => {
                    console.log(req.body);
                    res.send(generator.generateData(req.body));
                });
                break;
            case "PUT-db":
                this.app.put(path, async (req, res) => {
                    let rpath = req.originalUrl;
                    await generator.update(req.body, rpath).then((data) => {
                        res.send(data);
                        return;
                    });
                });
                break;
            default:
                console.error("Invalid method");
                break;
        }

    }
    start(port) {
        port = port || 3000;
        this.app.listen(port, () => {
            console.log("Server started on port", port);
        });
    }
}

// export all classes

module.exports = { SuppressLLM, DataGenerator, SuppresServer, DataStorage };
