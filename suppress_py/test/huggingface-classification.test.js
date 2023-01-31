const {HuggingFaceLLM} = require('../suppress_py.js');

jest.setTimeout(50000);



test("should score above 0.5", async () => {
    await new HuggingFaceLLM({
        task: "text-classification"
    }).generate("This restaurant is awesome").then((result) => {
        console.log(result);
        result = result[0][0]['score'];
        expect(result).toBeGreaterThan(0.5);
    });
});
