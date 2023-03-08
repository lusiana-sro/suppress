[![Documentation Status](https://readthedocs.org/projects/suppressjs/badge/?version=latest)](https://suppressjs.readthedocs.io/en/latest/?badge=latest)
![npm](https://img.shields.io/npm/v/ai.suppress.js)
![GitHub Repo stars](https://img.shields.io/github/stars/velocitatem/suppress?style=social)
![join](https://img.shields.io/badge/Join!-looking%20for%20colaborators-critical)



https://user-images.githubusercontent.com/60182044/221430021-200e982f-a66e-4de0-aed9-c99c36788538.mp4



Suppress.js is a small library that makes integrating AI into any existing or new application easy, and responsible.

# Quickstart 🏁

Who is this for? This library has been made to be used by developers at any level. If you are a beginner, you can use this library to get started with AI. If you are an expert, you can use this library to quickly integrate AI into your existing or new application.

## Ready 📥

Follow along with the [installation notebook](https://npm.runkit.com/ai.suppress.js) to get started.

First, install the package from npm:

```bash
npm install ai.suppress.js
```

## Set

Once installed, lets import some main components from the library:


```javascript
const { SuppresServer, DataGenerator, OpenAILLM } = require("ai.suppress.js");
```

Now we construct these components:

```javascript
const server = new SuppresServer();
const llm = new OpenAILLM("OPENAI_API_KEY");
```

Now that we have the base all set up, lets register some endpoints

```javascript
server.createEndpoint(
    "/hello/:name/:country",
    "GET",
    new DataGenerator(
        "Write a greeting for {name}. Create a brief description of {country}, in which the user lives.",
        JSON.stringify({"greeting":"string", "description":"string"}),
        llm
        )
    );
```

## Go
Now we can start the server:

```javascript
server.start();
```

And that's it! Now you can make requests to the server and get back data!

Run the server and make a request:

```bash
curl http://localhost:3000/hello/John/Spain
```

## 🚨 Responsibility & Security 🚨
When building apps which rely on AI, it is important to consider many factors. Here are some tools to help you build responsibly.
+ [Prompt Security Testing](https://github.com/velocitatem/llm-cross-prompt-scripting)
+ [Model Insight](https://github.com/velocitatem/InsightLink) (coming soon)
+ [User Key Management](https://github.com/velocitatem/omni) (coming soon)

# Documentation 🕮
You can find the full documentation [here](https://suppressjs.rtfd.io).
## Models
Suppress.js on it own supports OpenAI models for now. However, you can use any model that is supported by [HuggingFace Transformers](https://huggingface.co/transformers/), if you also install `mix.suppress.js` package.
## Key Features
* Gives structure to data produced by LLMs
* Allows for effortless integration of AI into existing projects
* You send the data, suppress handles it. You want the data? Suppress gets it.


# Contributing ➕
There is plenty to do! If you want to contribute, please following standard contributing guidelines. https://docs.github.com/en/get-started/quickstart/contributing-to-projects
