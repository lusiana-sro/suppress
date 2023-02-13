# Models
Suppress.js on it own supports only OpenAI models for now. However, you can use any model that is supported by [HuggingFace Transformers](https://huggingface.co/transformers/), if you also install `mix.suppress.js` package.

Each model in suppress is a child of the `SuppressModel` class, which gives us a common interface to work with. The `SuppressModel` class has the following methods:
* `generate(data)`: to return the output of the model for given data
* `beIrresnponsible()`: To omit any meta-data about the model. This will return the object itself.
* `adjust(key,value)`: To adjust any properties of the model object. This will return the object itself.

## [OpenAI Models](./openai.md)
## [HuggingFace Models](./hugging-face.md)
