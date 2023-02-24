# Aleph Alpha AI
This API uses luminous. Luminous is one of the world's most sophisticated AI language models.
For any clarification, please refer to the [Luminous documentation](https://docs.aleph-alpha.com/api/category/tasks/).

You will first need to create an account on [Aleph Alpha](https://aleph-alpha.com/) and get an API key.

Import the `AlephAlphaLLM` like so:

```js
const {AlephAlphaLLM} = require('ai.suppress.js');
```

Currently implemented tasks are: **complete, summarize, qa**. A simple completion example:

```js
let ai = new AlephAlphaLLM({apiKey:config.alephKey,
                          task:"complete",
                          model:"luminous-base"});


ai.generate("Hello, my name is ").then((res) => {
    console.log(res);
});
```

>  David and I am a professional photographer based in the UK. I have been shooting for over 20 years and have a passion for capturing the beauty of the world around me. I am a keen landscape and wildlife photographer and I am also a keen traveller. I have travelled extensively in the UK, Europe, North America,


## Summarization
Summarization is a task that takes a long text and summarizes it into a shorter text. The summarization task is implemented as a `summarize` task on the `AlephAlphaLLM` constructor. The generator in this case takes a single string as input and returns a single string as output.

```js
let ai = new AlephAlphaLLM({apiKey:config.alephKey,
                      task:"summarize",
                      model:"luminous-extended"});


ai.generate("VERY LONG TEXT").then((res) => {
    console.log(res);
});
```

## Question Answering
This one is very nice. It takes a question and a context and returns the answer. The question answering task is implemented as a `qa` task on the `AlephAlphaLLM` constructor. The generator in this case takes a single string as input and returns a single string as output.

```js
let ai = new AlephAlphaLLM({apiKey:config.alephKey,
                      task:"qa",
                      model:"luminous-extended"});


ai.generate({question:"What is the meaning of life?", context:"The meaning of life is to find your gift. The purpose of life is to give it away."}).then((res) => {
        console.log(res);
    });
```
