# OpenAI Models

Start by importing the `OpenAILLM ` class from `suppress.js` package.

```js
import { OpenAILLM } from 'suppress.js';
```

Then we can construct the model by passing the API key. You can get your API key from [OpenAI Dashboard](https://beta.openai.com/account/api-keys).

```js
let llm = new OpenAILLM("sk-fosd8..........ky2");
```

Now we can use the model to generate text. The `generate` method takes the prompt as the input. The main purpose of this is to pass it to the `DataGenerator` class, which will generate the data for the model. Learn more about the `DataGenerator` class [here](../DataGenerator/data-generator.md).


```js
let data = await llm.generate("Hello, my name is");
```
