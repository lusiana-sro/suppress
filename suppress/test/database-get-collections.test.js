const {SuppressLLM} = require('../suppress');
const prompts = require('../prompts');
const config = require('./config.json');

let llm = new SuppressLLM(config.key);


let collections = ["users", "beers", "clients", "orders", "reviews", "user_types"];
let mat = [
    [ '/api/db/get/user/type/Angry', 'user_types' ],
    [ '/api/db/get/user/birthday/1990-01-01', 'users' ],
    [ '/api/db/get/user/age/under/30', 'users' ],
    [ '/api/db/beers/get/beer/name/Heineken', 'beers' ],
    [ '/api/db/beers/get/beer/abv/under/5', 'beers' ],
    [ '/api/db/beers/get/beer/ibu/under/30', 'beers' ],
    [ '/api/db/clients/get/client/name/John', 'clients' ],
    [ '/api/db/clients/get/client/quota/under/100', 'clients' ],
    [ '/api/db/order/placed/2018-01-01', 'orders' ],
    [ '/api/db/order/total/under/100', 'orders' ],
    [ '/api/db/order/beer/name/Heineken', 'orders' ],
    [ '/api/db/reviews/above/3', 'reviews' ],
    [ '/api/db/reviews/beer/name/Heineken', 'reviews' ],
    [ '/api/db/reviews/client/name/John', 'reviews' ],
    [ '/api/db/clients/get/all/clients', 'clients' ],
    [ '/api/db/breweries/get/all/breweries', 'breweries' ],
    [ '/api/db/beers/get/all/beers', 'beers' ],
    [ '/api/db/users/get/all/users', 'users' ],
    [ '/api/db/orders/get/all/orders', 'orders' ],
    [ '/api/db/reviews/get/all/reviews', 'reviews' ]
]


posts.forEach((post) => {
    console.log(post[1]);
    test("Correctly identifies existing collection - "+post[0], async () => {
        await llm.generate(prompts.database.get.collectionChoice(post[0], collections)).then((answer) => {
            answer = answer.toLowerCase().trim();
            let exp = post[1];
            console.log(answer, exp);
            expect(answer).toContain(exp);
        });
    });
});
