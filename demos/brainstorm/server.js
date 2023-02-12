const config = require('./config.json');
const {OpenAILLM, DataGenerator, SuppresServer, SuppressSequence, DataStorage } = require("ai.suppress.js");

let storage = new DataStorage("Brainstorming", config.key);
let server = new SuppresServer();
server.mountDatabase(storage);

server.start(3001);
