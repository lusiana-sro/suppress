const {SuppressModel} = require('ai.suppress.js');
const {PythonShell} = require('python-shell');

/*

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
*/

class HuggingFaceLLM extends SuppressModel {


    constructor(props) {
        super(props);
        this.props = props;
        this.about = {
            name: "HuggingFace LLM",
            omniID: this.props.model
        };
    }


    async generate(params) {
        this.lastParams = params;

        // params is a json object with the following fields:
        // key: value
        // we need to conver this to
        // base64 encode the json object

        let encodedParams = Buffer.from(JSON.stringify(params)).toString('base64');
        let finalFlags = [];
        let flags = [['--task', this.props.task],[ '--model', this.props.model], ['--params', encodedParams]];
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
            scriptPath: __dirname,
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

        res = res[0];

        if(this.irresponsible){
            return res;
        } else {
            return this.responsibleResponse(res);
        }
    }
}

module.exports = {HuggingFaceLLM};
