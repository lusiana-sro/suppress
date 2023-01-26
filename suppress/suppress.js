import express from 'express';
import { Configuration, OpenAIApi } from "openai";



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
            max_tokens: 700,
        }).then((data) => {
            data = data.data.choices[0].text;
            return data;
        }).catch((error) => {
            console.error(error);
            return error;
        });
    }
}

class DataGenerator {
    constructor(prompt, format, llm) {
        this.prompt = prompt;
        this.format = format;
        this.llm = llm;
        this.log1 = true;
        this.parseJson = true;
    }

    async formatOutput(data) {
        let prompt = `${data}\nuse the above data and structure it acording to the following format:\n${this.format}\nStructured data:\n`;
        return await this.llm.generate(prompt).then((output) => {
            return this.parseJson ? JSON.parse(output) : output;
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
                console.log(data);
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
            case "POST":
                this.app.post(path, (req, res) => {
                    console.log(req.body);
                    res.send(generator.generateData(req.body));
                });
                break;
            default:
                console.error("Invalid method");
                break;
        }

    }
    start() {
        this.app.listen(3000, () => {
            console.log("Server started on port 3000");
        });
    }
}

// export all classes

export { SuppressLLM, DataGenerator, SuppresServer };
