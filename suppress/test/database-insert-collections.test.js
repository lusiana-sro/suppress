const {SuppressLLM} = require('../suppress');
const prompts = require('../prompts');
const config = require('./config.json');

let llm = new SuppressLLM(config.key);

    // test POST requests to insert new data into the database
let posts = [
    ['/api/db/new/bloodtype', {"id":9282,"uid":"1479e4aa-bd90-4fa0-b6c7-7496516f855f","type":"AB","rh_factor":"+","group":"O+"}],
    ['/api/db/beers/new', {"id":2390,"uid":"e6798933-e07a-408d-a2bb-a739a0b3542a","brand":"Red Stripe","name":"Old Rasputin Russian Imperial Stout","style":"Pilsner","hop":"Comet","yeast":"5526 - Brettanomyces lambicus","malts":"Caramel","ibu":"58 IBU","alcohol":"6.4%","blg":"11.9°Blg"}],
    ['/api/db/beer', {"id":660,"uid":"59d8c4af-b015-4e61-bdc2-aeb00be2d5b6","brand":"Paulaner","name":"90 Minute IPA","style":"Strong Ale","hop":"Horizon","yeast":"3787 - Trappist High Gravity","malts":"Roasted barley","ibu":"35 IBU","alcohol":"2.4%","blg":"8.5°Blg"}],
    ['/api/db/add/user', {"id":484,"uid":"ea303311-c7dd-418e-8514-f83db88bdaa7","password":"TkXizjIumq","first_name":"Don","last_name":"Borer","username":"don.borer","email":"don.borer@email.com","avatar":"https://robohash.org/etconsequunturautem.png?size=300x300\u0026set=set1","gender":"Male","phone_number":"+256 (687) 087-8673 x70944","social_insurance_number":"761362979","date_of_birth":"1961-06-28","employment":{"title":"Forward Strategist","key_skill":"Fast learner"},"address":{"city":"Codyfort","street_name":"Kreiger Crest","street_address":"5773 Cedric Unions","zip_code":"07210-0692","state":"Iowa","country":"United States","coordinates":{"lat":-3.498680552148315,"lng":-28.98315333637754}},"credit_card":{"cc_number":"4167-5305-7106-5454"},"subscription":{"plan":"Essential","status":"Blocked","payment_method":"Money transfer","term":"Full subscription"}}],
    ['/api/db/user/new', {"id":6400,"uid":"8c12c783-0410-453e-8e16-8fa5d95cd5bc","password":"TfMN8oXYyj","first_name":"Lamont","last_name":"Dicki","username":"lamont.dicki","email":"lamont.dicki@email.com","avatar":"https://robohash.org/nisiexmaiores.png?size=300x300\u0026set=set1","gender":"Female","phone_number":"+65 540.879.6401 x3853","social_insurance_number":"201061025","date_of_birth":"1974-12-03","employment":{"title":"Marketing Liaison","key_skill":"Confidence"},"address":{"city":"Xavierstad","street_name":"Ranae Orchard","street_address":"2512 Adams Street","zip_code":"15671-7535","state":"Hawaii","country":"United States","coordinates":{"lat":-45.96812568334725,"lng":116.65620976347975}},"credit_card":{"cc_number":"6771-8974-8864-1351"},"subscription":{"plan":"Basic","status":"Idle","payment_method":"Debit card","term":"Monthly"}}]
];

let answers = ['bloodtype', 'beer', 'beer', 'user', 'user'];

let collections = [];
posts.forEach((post) => {
    console.log(post[1]);
    test("Correctly identifies existing collection - "+post[0], async () => {
        await llm.generate(prompts.database.add.collectionChoice(post[1], post[0], collections)).then((answer) => {
            answer = answer.toLowerCase().trim();
            let exp = answers.shift();
            collections.push(answer);
            console.log(answer, exp);
            expect(answer).toContain(exp);
        });
    });
});
