# Cohere AI


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


You can import the model like this:

```js
const {CohereAILLM} = require('ai.suppress.js');
```
