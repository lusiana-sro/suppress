const {OpenAILLM , DataGenerator, SuppresServer} = require('ai.suppress.js');
const config = require('./config.json');

const llm = new OpenAILLM(config.key);
const server = new SuppresServer();

server.createEndpoint(
    "/api/testimonial/:name/:location/:feelings",
    "GET",
    new DataGenerator(
        "Name: {name}\nLocation: {location}\nFeelings: {feelings}\nGiven the above information about the person above. Create a testimonial written by them. This testimonial should be in the first person and maximum 3 sentences long.\nTestimonial:",
        // response html
        JSON.stringify({
            "testimonial": "string"
        }),
        llm
    )
);

server.start();
