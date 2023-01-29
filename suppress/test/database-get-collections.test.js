const {SuppressLLM} = require('../suppress');
const prompts = require('../prompts');
const config = require('./config.json');

let llm = new SuppressLLM(config.key);

    // test POST requests to insert new data into the database
let posts = [
    '/api/db/get/user/type/Angry',
    '/api/db/get/user/birthday/1990-01-01',
    '/api/db/get/user/age/under/30',
    '/api/db/beers/get/beer/name/Heineken',
    '/api/db/beers/get/beer/abv/under/5',
    '/api/db/beers/get/beer/ibu/under/30',
    '/api/db/clients/get/client/name/John',
    '/api/db/clients/get/client/quota/under/100',
    '/api/db/order/placed/2018-01-01',
    '/api/db/order/total/under/100',
    '/api/db/order/beer/name/Heineken',
    '/api/db/reviews/above/3',
    '/api/db/reviews/beer/name/Heineken',
    '/api/db/reviews/client/name/John',
    '/api/db/clients/get/all/clients'


];

// these are the collections which should be returned by the above requests
let answers = [
    'user_types',
    'users',
    'users',
    'beers',
    'beers',
    'beers',
    'clients',
    'clients',
    'orders',
    'orders',
    'orders',
    'reviews',
    'reviews',
    'reviews',
    'clients'
];



let collections = ["users", "beers", "clients", "orders", "reviews", "user_types"];
posts.forEach((post) => {
    console.log(post[1]);
    test("Correctly identifies existing collection - "+post, async () => {
        await llm.generate(prompts.database.get.collectionChoice(post, collections)).then((answer) => {
            answer = answer.toLowerCase().trim();
            let exp = answers.shift();
            console.log(answer, exp);
            expect(answer).toContain(exp);
        });
    });
});

// combine tests and answers into a matrix
let matrix = [];
for (let i = 0; i < posts.length; i++) {
    matrix.push([posts[i], answers[i]]);
}

console.log(matrix);
