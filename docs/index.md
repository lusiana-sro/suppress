# Table of Contents

1.  [LLM](#orgeb91a0f)
2.  [Server](#org64d6355)
    1.  [Endpoint Types](#org6073242)
    2.  [Registering](#org5ee0edd)
3.  [Data Storage](#org372fce9)
4.  [Data Generator](#org5ab8905)



<a id="orgeb91a0f"></a>

# LLM

For now, this is just a wrapper for openai, but you can extend it to anything you want, all you need is the `constructor` to configure the model and then define `generate()` to&#x2026; generate.


<a id="org64d6355"></a>

# Server

This is just a wrapper around express, it allows you to access the AI tools through HTTP requests.

    const {SuppressServer} = require("ai.suppress.js")
    const server = new SuppressServer()


<a id="org6073242"></a>

## Endpoint Types

To create a new endpoint, you have the following options:

-   **`GET`:** A simple endpoint which will only consider anything passed in the url.
-   **`POST`:** Same as `GET` but will only consider the data passed in the body.

The above endpoints will respond by using an LLM to generate some content. With the following endpoints, you can make use of AI to manage your data:

-   **`GET-db`:** This endpoint kind will take into consideration the entire url (including query options) and will respond with something from the database.
-   **`POST-db`:** Same as `GET-db` but rather made for adding new data to the database.
-   **`PUT-db`:** This endpoint allows you to modify existing items stored in the database


<a id="org5ee0edd"></a>

## Registering

An endpoint is added in the following way:

    let endpoint = "/say/hello/to/:name"
    let endpointType = "GET"
    let generator = DataStorage || DataGenerator

    // now we pass all of it to the server
    server.createEndpoint(endpoint, endpointType, generator)

You can also add a regular express endpoint making use of `server.app`, which returns the express app object.


<a id="org372fce9"></a>

# Data Storage

This can store your data without you having to deal with the database.
You just send it data as you want, it handles it. Then later you can ask for the data in some undefined way and it will give it to you

First, you need to create a `DataStorage` object. This is the object that will handle all the data for you. You can create it like this:

    const dataStorage = new DataStorage("<DATABASE_NAME>", "<OPEN_AI_KEY>");

Frankly, it doesnt matter what database name u use, it doesnt care. Now you have to register the endpoint to handle the data. You can do this like this:

    server.mountDatabase(dataStorage);


<a id="org5ab8905"></a>

# Data Generator

The generator is an object responsible for processing *the input*, *the desired output* and the LLM used to create the response.

We first need to define what we want and what we get:

-   **`Template`:** This is the prompt, into which we pass the parameters we get from the request body/params.
-   **`Format`:** This should be a string which defines how the result created by the LLM should be processed and formated.
-   **`LLM`:** Last but not least, we need to tell the generator what LLM to use.

In this example we want to get some information about historical events [maybe not the best example].

Lets first define how we want our final data to look and what model to use:

    const prompt = "Provide information on {event}. This information must include the date, key figures and key locations",
    const format = {
     "eventName":"string",
     "eventDate":"int",
     "keyFigures":[
        "string",
        "string",
        ".."
     ],
     "keyLocations":[
        "string",
        "string",
        ".."
     ]
    }
    const llm = new OpenAILLM(openAIenvKey);

Now if we put everything together&#x2026;

    server.createEndpoint("/data/historical/:event", "GET", new supDataGenerator(
        "Provide information on {event}. This information must include the date, key figures and key locations",
        "{\"eventName\":\"string\",\"eventDate\":\"int\",\"keyFigures\":[\"string\",\"string\",\"..\"],\"keyLocations\":[\"string\",\"string\",\"..\"]}",
        llm));

Then send a GET to `http://localhost:3000/data/historical/pearl%20harbor`, we get:

    {
      "eventName": "Pearl Harbor Attack",
      "eventDate": 1941,
      "keyFigures": [
        "Admiral Husband Kimmel",
        "Lieutenant General Walter Short",
        "Admiral Isoroku Yamamoto"
      ],
      "keyLocations": [
        "Pearl Harbor",
        "Ford Island",
        "Hickam",
        "Wheeler",
        "Bellows airfields"
      ]
    }

Cool, no? Ofc, you should be a lot more specific in the prompt, but as a demo, I think this will do :)
