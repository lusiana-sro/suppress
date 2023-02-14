# Data Storage
Save, access and modify data in a mongodb database, without having to write much code for it. Assuming you have `ai.suppress.js` installed and a mongodb database running, you can use the following code to create an API access to a collection in the database.

* MongoDB install instructions: https://docs.mongodb.com/manual/installation/

## Setup
For this to work, you will need to get an API key from OpenAI. You can get your API key from [OpenAI Dashboard](https://beta.openai.com/account/api-keys). First we need to import the Server and Storage.

```js
const { DataStorage, SuppressServer } = require('ai.suppress.js');
```

Next, we can construct each of the classes. The `SuppressServer` class is used to create an API server, and the `DataStorage` class is used to access the database.

```js
const server = new SuppressServer();
const storage = new DataStorage('myCollection', "OpenAI-API-KEY");
```

Now we can start the server and connect to the database.

```js
server.mountDatabase(storage);
server.start();
```

Now you can access the database using the API. You can use the following endpoints to access the database.

## Endpoints

Before we go further, we need to define how this works. This module will take the URL path or body, and based on that, it will query the database.
Take a look at this post, demonstrating it in action: [here](https://www.linkedin.com/posts/daniel-rosel_what-good-is-an-ai-run-server-without-a-database-activity-7025131732374827008-uw9v?utm_source=share&utm_medium=member_desktop)


* `/api/db/:any/../:query` - GET - Will get you the data you want, based on the query path.
* `/api/db/:any/../:query` - POST - Will insert the data you want, based on the query path.
* `/api/db/:any/../:query` - PUT - Will update the data you want, based on the query path.
