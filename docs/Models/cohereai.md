# Cohere AI
Cohere AI is a wonderful tool for using LLMs to generate text. It is a paid service, but it is very affordable. You can sign up for a free trial [here](https://cohere.ai/).

You can import the model like this:

```js
const {CohereAILLM} = require('ai.suppress.js');
```

We currently offer three features of Cohere AI: **generate, summarize, and classify**. You can use the model like this:

```js
let config = {
  apiKey: "COHERE API KEY",
  task: "generate",
  model: "medium"
};

let llm = new CohereAILLM(config);

let data = await llm.generate("Hello, my name is");
```


## Summarize
To use Cohere to summarize text, you should first change the task to "summarize" and then pass in the text you want to summarize as the input. The input should be an object with the following keys:

- text: the text you want to summarize
- length: the length of the summary you want to generate (default is 100)

```js
let config = {
  apiKey: "COHERE API KEY",
  task: "summarize",
  model: "summarize-medium"
};

let llm = new CohereAILLM(config);

let data = await llm.generate({text: "A WHOLE LOT OF TEXT HERE", length: 100});
```

## Classify
To use Cohere to classify text, you should first change the task to "classify" and then pass in the text you want to classify as the input. The input should be an object with the following keys:

- text: the text you want to classify
- examples: an array of examples of the text you want to classify

```js
let config = {
  apiKey: "COHERE API KEY",
  task: "classify",
  model: "large"
};

let llm = new CohereAILLM(config);

let data = await llm.generate({text: "A WHOLE LOT OF TEXT HERE", examples: ["example1", "example2"]});
```

Please refer to classification docs [here](https://docs.cohere.ai/reference/classify) for more information.
