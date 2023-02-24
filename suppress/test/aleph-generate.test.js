const {AlephAlphaLLM} = require('../suppress');
const config = require('./config');


test('complete', () => {
    let ai = new AlephAlphaLLM({apiKey:config.alephKey,
                              task:"complete",
                                model:"luminous-base"});
    return ai.generate("Hello, my name is ").then((res) => {
        console.log(res);
        expect(res).not.toBeNull();
    });
});


test('summarize', () => {

    let ai = new AlephAlphaLLM({apiKey:config.alephKey,
                          task:"summarize",
                          model:"luminous-extended"});
    return ai.generate("Why should I become staff? Well to be honest, that is a very easy question to answer. I am perfection itself, why wouldn’t you want one as omnipotent as yours truly in a position of power? I would craft, shape, and perfect this server till none other can rival it and thus bringing forth millions upon millions of subscribers to strengthen the ranks of your channel till you are not only number one, but the undisputed ruler of youtube. You are being handed a gift from the All Mother, and I know this server’s staff are not foolish enough to toss away a gift from the Goddess. If you toss away this application, you not only betray this server, but God himself").then((res) => {
        console.log(res);
        expect(res).not.toBeNull();
    });
});


test('qa', () => {

    let ai = new AlephAlphaLLM({apiKey:config.alephKey,
                          task:"qa",
                          model:"luminous-extended"});

    return ai.generate({question:"What is the meaning of life?", context:"The meaning of life is to find your gift. The purpose of life is to give it away."}).then((res) => {
        console.log(res);
        expect(res).not.toBeNull();
    });

})
