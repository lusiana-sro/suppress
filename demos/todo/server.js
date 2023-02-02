// import all the components we are going to use
const {
    OpenAILLM,
    DataGenerator,
    SuppresServer,
    DataStorage }
      = require('../../suppress/suppress.js');

// import our API key for OpenAI
const config = require('./config.json');


/*
 *
 * We add access to the database
 *
 */

// create new instance of the SuppresServer
const server = new SuppresServer();

// create new instance of the DataStorage
const dataStorage = new DataStorage(
    "prepre", // this is the database name
    config.key // this is the API key
);

// we add the data storage to the server
server.mountDatabase(dataStorage);

/*
 *
 * We add the data generator to the server
 *
 */

// create new instance of an LLM
const llm = new OpenAILLM(config.key);

const dataGenerator = new DataGenerator(
    "Write a motivational sentence, to encourage a user to complete their task: {task}.\nMotivational sentence:", // we want to get motivational quotes to complete specific tasks
    JSON.stringify({"task": "string", "sentence": "string"}), // now we need to give the output some format
    llm);

server.createEndpoint(
    "/api/motivate/:task",
    "GET",
    dataGenerator // we register the data generator
);


// we start the server at port 3000
server.start(3000);
