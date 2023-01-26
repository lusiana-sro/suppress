
# Table of Contents

1.  [Get Started](#org9283b57)

**Are you looking for a way to easily integrate complex features into your applications?**

Look no further than Suppress! Suppress is a node.js framework that makes it easy to add powerful features to your app with just a few lines of code. It is built on top of Express.js and uses AI to make your life easier.
With Suppress, you can quickly and easily add features and **take your app to the next level!**


<a id="org9283b57"></a>

# Get Started

1.  `npm i ai.suppress.js`
2.  Create a file named `server.js` and add the following code:
    
        import {SuppressLLM, DataGenerator, SuppresServer} from 'ai.suppress.js';
        const llm = new SuppressLLM("API_KEY");
        const server = new SuppresServer();
        
        # create hello world route
        server.createEndpoint(
            "/hello/:name/:country",
            "GET",
            new DataGenerator(
                "Greet {name}. Create a brief description of {country}, in which the user lives.",
                JSON.stringify({"greeting":"string", "description":"string"}),
                llm
                )
            );
        
        server.start();
3.  Run the server using `node server.js`
4.  Open your browser and go to `http://localhost:3000/hello/John/China` [Replace with your name and country]

Learn more about Suppress.js in the DOCS [here](./DOCS.md).

