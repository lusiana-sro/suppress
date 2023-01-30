// import all the components we are going to use
const {
    SuppressLLM,
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


// create new instance of an LLM
const llm = new SuppressLLM(config.key);


let prompt = `
These are questions for a research project on financial literacy.
1.) do you use a debit card
2.) How many cards do you carry in your wallet
3.) Do you have store brand card or major credit card?
4.) How many times a week do you use a credit debit card
5.) What would you estimate is the average dollar amount of each transaction on your card? $10 or less, more than $10 but less than $50
6.) What incentives are offered by your debit card?
7.) What are the advantages of using one?
8.) What are the disadvantages?
These are the responses to the questions:
{answers}
Extract the answers from the responses and assign them to the questions.
`;

let formatedQuestions = {
    "usesDebitCard": {
        "question": "do you use a debit card",
        "answer": "BOOLEAN"
    },
    "numberOfCards": {
        "question": "How many cards do you carry in your wallet",
        "answer": "NUMBER"
    },
    "hasStoreBrandCard": {
        "question": "Do you have store brand card or major credit card?",
        "answer": "BOOLEAN"
    },
    "numberOfTransactions": {
        "question": "How many times a week do you use a credit debit card",
        "answer": "NUMBER"
    },
    "averageTransactionAmount": {
        "question": "What would you estimate is the average dollar amount of each transaction on your card? $10 or less, more than $10 but less than $50",
        "answer": ["lt10", "gt10lt50"]
    },
    "incentives": {
        "question": "What incentives are offered by your debit card?",
        "answer": ["STRING", "STRING", "STRING"]
    },
    "advantages": {
        "question": "What are the advantages of using one?",
        "answer": ["STRING", "STRING", "STRING"]
    },
    "disadvantages": {
        "question": "What are the disadvantages?",
        "answer": ["STRING", "STRING", "STRING"]
    }
};

const dataGenerator = new DataGenerator(
    prompt,
    JSON.stringify(formatedQuestions),
    llm);

server.createEndpoint(
    "/api/process/research",
    "POST",
    dataGenerator // we register the data generator
);


// we start the server at port 3000
server.start(3000);
