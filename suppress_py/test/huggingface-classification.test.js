const {HuggingFaceLLM} = require('../suppress_py.js');

jest.setTimeout(50000);



test("should score above 0.5", async () => {
    await new HuggingFaceLLM({
        task: "zero-shot-classification",
    }).generate({query:"How are you?", options:['Question','Command']}).then((result) => {
        console.log(result);
        expect(result[0].scores[0]).toBeGreaterThan(0.8);
    });
});
