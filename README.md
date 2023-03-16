# Suppress.js 🤖🚀

Easily and responsibly integrate AI into your applications!

[![Documentation Status](https://readthedocs.org/projects/suppressjs/badge/?version=latest)](https://suppressjs.readthedocs.io/en/latest/?badge=latest)
![npm](https://img.shields.io/npm/v/ai.suppress.js)
![GitHub Repo stars](https://img.shields.io/github/stars/velocitatem/suppress?style=social)
![join](https://img.shields.io/badge/Join!-looking%20for%20colaborators-critical)

![Demo](https://user-images.githubusercontent.com/60182044/221430021-200e982f-a66e-4de0-aed9-c99c36788538.mp4)

## Why Suppress.js? 🤔

Whether you're a beginner looking to dive into AI or an expert developer seeking a quick and clean way to incorporate AI into your projects, Suppress.js is the go-to library for seamless AI integration.

## Features ✨

- **Beginner-friendly:** Get started with AI easily, no prior experience needed
- **Responsible AI:** Designed with ethics and responsibility in mind
- **Extensible:** Compatible with a wide range of AI models and platforms
- **Lightweight:** Small library size ensures minimal impact on your application's performance

## Quickstart 🏁

1. Install Suppress.js: `npm install ai.suppress.js`
2. Import the library: `const { SuppresServer, DataGenerator, OpenAILLM } = require("ai.suppress.js");`
3. Initialize and use AI models:

```javascript
const server = new SuppresServer();
const llm = new OpenAILLM("OPENAI_API_KEY");
```

4. Enjoy seamless AI integration!

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
## Documentation 📚

For detailed usage instructions, examples, and customization options, visit our [documentation](https://suppressjs.readthedocs.io/en/latest/).

## Get Involved 💡

We're always looking for collaborators! If you're interested in joining the team and contributing to the project, [get in touch](https://github.com/velocitatem/suppress/issues/new?assignees=&labels=&template=feature_request.md&title=)!


## 🚨 Responsibility & Security 🚨
When building apps which rely on AI, it is important to consider many factors. Here are some tools to help you build responsibly.
+ [Prompt Security Testing](https://github.com/velocitatem/llm-cross-prompt-scripting)
+ [Model Insight](https://github.com/velocitatem/InsightLink) (coming soon)
+ [User Key Management](https://github.com/velocitatem/omni) (coming soon)

## Models
Suppress.js on it own supports OpenAI models for now. However, you can use any model that is supported by [HuggingFace Transformers](https://huggingface.co/transformers/), if you also install `mix.suppress.js` package.
## Key Features
* Gives structure to data produced by LLMs
* Allows for effortless integration of AI into existing projects
* You send the data, suppress handles it. You want the data? Suppress gets it.
