import {suppressLLM, DataGenerator, SuppresServer} from './suppress.js';


let openAIenvKey = '';

// create an instance of an LLM, by default this is OPENAI
const llm = new suppressLLM(openAIenvKey);

// create the server, to host the endpoints
const server = new SuppresServer();


// now we want the server to do something. Here we build a generator, which will generate a response to a prompt which it receives at the endpoint

// With the generator built, we can now add it to the server
server.createEndpoint("/generate/:topic/:number", "GET", new DataGenerator(
    "Write {number} sentences about {topic} .",
    "[\"sentence\",...]",
    llm));

server.createEndpoint("/data/historical/:event", "GET", new DataGenerator(
    "Provide information on {event}. This information must include the date, key figures and key locations",
    "{\"eventName\":\"string\",\"eventDate\":\"int\",\"keyFigures\":[\"string\",\"string\",\"..\"],\"keyLocations\":[\"string\",\"string\",\"..\"]}",
    llm));


// now we can start the server
server.start();
