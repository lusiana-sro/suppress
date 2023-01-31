const {SuppressLLM , DataGenerator, SuppresServer} = require('../../../suppress/suppress.js');
const {HuggingFaceLLM} = require('../../suppress_py.js');
const server = new SuppresServer();

let llm = new HuggingFaceLLM({
    task: 'sentiment-analysis',
    model: 'distilbert-base-uncased-finetuned-sst-2-english'
});

let generator = new DataGenerator(
    "{sentence}",
    null,
    llm
).set({format:false})


server.createEndpoint(
    "/sentiment/analyze/:sentence",
    "GET",
    generator
);

server.start();
