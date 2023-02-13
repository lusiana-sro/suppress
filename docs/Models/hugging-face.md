# Huggingface

To use any model from Huggingface, you need to install the `mix.suppress.js` package. Then you can import the `HuggingFaceLLM` class from the package.

```js
import { HuggingFaceLLM } from 'mix.suppress.js';
```

When we construct the model, we need to pass:

* Model name or task
* Input Parameters

For example, if we want to classify if a string is a question or command, we first create the model object.

```js
let model = new HuggingFaceLLM({
    task: "zero-shot-classification"
});
```

Then we pass the input parameters, which in this case is the text and the labels.

```js
model.generate({query:"Hello, how are you?", candidate_labels:["question", "command"]})
.then((data) => {
    console.log(data);
});
```
