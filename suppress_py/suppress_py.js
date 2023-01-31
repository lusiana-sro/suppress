const {SuppressLLM} = require('ai.suppress.js');
const {PythonShell} = require('python-shell');


class HuggingFaceLLM {

    constructor(props) {
        this.props = props;
        this.tasks = [
            "conversational",
            "fill-mask",
            "question-answering",
            "sentence-similarity",
            "summarization",
            "table-question-answering",
            "text-classification",
            "text-generation",
            "token-classification",
            "translation",
            "zero-shot-classification"
        ];
    }

    async postProcess(self) {
        return self.lastResult;
    }

    async generate(prompt) {
        this.lastPrompt = prompt;
        // if the function was called by a server, it will pass in a JSON object. This should have only one key, which is the prompt. the name of the key is not important.
        if (typeof prompt === 'object') {
            prompt = prompt[Object.keys(prompt)[0]];
        }
        let finalFlags = [];
        let flags = [['--task', this.props.task],[ '--model', this.props.model],[ '--prompt', prompt]];
        flags.forEach(flag => {
            if (flag[1] != undefined && flag[1] != null) {
                finalFlags.push(flag[0]);
                // if the value has a space, add quotes around it
                if (flag[1].includes(' ')) {
                    finalFlags.push(`"${flag[1]}"`);
                } else {
                    finalFlags.push(flag[1]);
                }
            }
        });

        let options = {
            mode: 'json',
            pythonPath: 'python',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: './',
            args: finalFlags
        };

        console.log(options);


        let res = await new Promise((resolve, reject) => {
            PythonShell.run(`huggingface.py`, options, function (err, results) {
                if (err) reject(err);
                console.log(this);
                resolve(results);
            });
        });
        this.lastResult = res;
        return this.postProcess(this);
    }
}

module.exports = {HuggingFaceLLM};
