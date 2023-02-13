# Data Generator
This is the heart of Suppress. It implements an algorithm that takes a prompt and a format and generates data based on the prompt and format.

## How it works
By default the user should interact with the object just by passing the parameters to the constructor. and then passing the object to the server.

The object has a method called `generate` that takes the passed parameters and generates the data. The server normally calls this method and returns the generated data to the client over the WEB.

## Constructor Parameters
The parameters are passed to the constructor of the object. The parameters are:
* `prompt`|`string` - The prompt that the user wants to generate data for.
* `format`|`string` - The format of the data that the user wants to generate
* `llm`|`SuppressModel` - The model that the user wants to use to generate the data.

## `generate` method
This method only takes the `data` which is supposed to be parsed into the prompt. It uses the parameters that were passed to the constructor. It returns an `object` that is the generated data with some metadata. The response format depends on the LLM used.

### What should the `data` look like?
The data should be a json, where the keys are the names of the variables in the prompt and the values are the values of the variables. For example, if the prompt is `I have {number} apples` and the data is `{"number": 5}`, then the generated data will be based on `I have 5 apples`.


### Example Response
In this example lets use `OpenAILLM` as the LLM.

```json
{
    "response": "This is the generated string or JSON or whatever the format is.",
    "about": {
        "model": "OpenAI GPT-3",
        "omniID": "text-davinci-003"
    }
}
```

Again, the result depends on the LLM used, but this is the general structure of the `SuppressModel`. You can find more information about the LLMs in the [LLM documentation](../Models/models.md).


## Properties of the DataGenerator
The DataGenerator has the following properties:
* `parseJson`|`boolean` - This property is used to tell the DataGenerator to parse the JSON that is returned from the formatter. The default value is `true`.
* `doFormat`|`boolean` - This property is used to tell the DataGenerator to format the data that is returned from the LLM. This is useful when the LLM returns a string. The default value is `true`.

You can customize these properties when creating the DataGenerator object. Use the `set` method to set the properties.

```js
const dg = new DataGenerator(prompt, format, llm).set({
    parseJson: false,
    doFormat: true
});
```

The `set` method returns the DataGenerator object so you can chain the methods.
