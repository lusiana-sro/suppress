# Getting Started Guide

In this guide, we will walk you through the process of setting up a new project with *suppress.js*.

## Installation

To install *suppress.js*, you can use `npm`.

```bash
npm install ai.suppress.js
```

This will install the latest version of *suppress.js*, with the basic functionality, if you want more functionality, you can install the plugins from **mix.suppress.js**.

```bash
npm install mix.suppress.js
```

## Usage
Suppress is very adaptable to your needs, you can use it in many ways, but our recommendation is to build around the library.

Start by creating a new file, and import some key components.

```bash
touch server.js
```

Start by:

```js
import { OpenAILLM, SuppressServer, DataGenerator } from 'ai.suppress.js';
```

Now, we need to create a new instance of the `SuppressServer` class, this will be our server. We will also need to create a new instance of the `OpenAILLM` class, this will be our language model.

```js
const server = new SuppressServer();
const llm = new OpenAILLM("YOUR_OPENAI_API_KEY");
```

Now, we need to create the core of our application, this is the `DataGenerator` class. This class will be responsible for generating the data using our language model.

```js
const prompt = "{introduction}\nBased on the above introduction, list the following information: Name, Age and Location:";
const format = JSON.stringify({
  "name": "string",
  "age": "integer",
  "location": "string"
});
const dataGenerator = new DataGenerator(prompt, format, llm);
```

Now, we need to create a new route for our server, this route will be responsible for generating the data.

```js
server.createEndpoint(
  "/new/person/:introduction",
  "GET",
  dataGenerator);
```

You might have noticed `{introduction}` in the prompt, this is a placeholder, and it will be replaced by the value of the `introduction` parameter which is passed in the URL. Depending on the `method` of the endpoint, the parameters will be passed in different ways. For more information, check out the [Server API](./Server/server.md).

Now, we need to start our server.

```js
server.start(3042);
```

Use your choice of startup script to start your server, and you are good to go! If you are unsure, you can just run:

```bash
node server.js
```

Now, we can test our server by going to `http://localhost:3042/new/person/My%20name%20is%20John%2C%20I%20am%2020%20years%20old%2C%20and%20I%20live%20in%20New%20York.` in our browser, and we should see the following output:

```json
{
  "name": "John",
  "age": 20,
  "location": "New York"
}
```

To fully understand how each component works, please refer to the documentation for each component.
- [SuppressServer](./Server/server.md)
- [OpenAILLM](./Models/openai.md)
- [DataGenerator](./DataGenerator/data-generator.md)
