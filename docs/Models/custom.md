# Custom Models
If you have a custom model you want to use with Suppress, the first decision to make is if you want to connect it either via a REST API or directly with python.

## REST API
To connect your model via an REST API, you do not need to install any additional packages, you can just use `ai.suppress.js`. Then, use the `SuppressModel` 'interface' to implement your model. The following is the interface for the `SuppressModel`:

```js
const {SuppressModel} = require('ai.suppress.js');

class MyModel extends SuppressModel {
  constructor() {
    super();
    // add model registration (optional)
    this.about = {
      model: "My Own Model",
      omniID: "my-model-lambda-delta-8"
    };
    // configure your model here
  }


  async generate(prompt) {
    // here return your models output
    let res = "given output"

    // if you want to return information about the model, return
    return this.responsibleResponse(res);

    // if not, just return the output
    return res;
  }
}
```
