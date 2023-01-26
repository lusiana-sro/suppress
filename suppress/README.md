
# Table of Contents

1.  [Get Started](#orgd8eb619)
2.  [Use Case](#org8c0d58d)

Suppress is a node.js framework which can help you integrate complex features into your applications, with ease. It is built on top of Express.js and uses AI to make your life easier.


<a id="orgd8eb619"></a>

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


<a id="org8c0d58d"></a>

# Use Case

-   Define endpoints.

