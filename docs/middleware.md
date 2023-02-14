# Suppress as Middleware for Express
If you have an existing express backend, you can easily integrate suppressjs as a middleware to enhance your existing express app. Currently only words for `DataGenerator`, does not support database management.

## Installation
```bash
npm install ai.suppress.js
```

## Setup
First, make import `SuppressMiddleware` from `ai.suppress.js`.

```javascript
const express = require('express');
const {SuppressMiddleware} = require('ai.suppress.js');
```
Now you can use `SuppressMiddleware` as a middleware in your express app.

```javascript
const app = express();
app.use(SuppressMiddleware);
```

## Usage
Now, among your other endpoints, you can create a new endpoint for suppressjs to handle.
All you need to do is add a simple JSON to the request. Here is an example:

```javascript
app.get('/complete/lyrics/:lyrics', (req,res)=>{
    req.suppress = {
        prompt: "Complete the lyrics: {lyrics}",
        format: JSON.stringify({lyrics: "string"}),
        llm: llm // ofc, you need to import your llm of choice
    };
});
```

Now, this endpoint will be handled by suppressjs and will return a JSON response with the generated text.
The **key identifier** for suppress to take over, is the `req.suppress` object. Make sure not to trigger it in other endpoints.
