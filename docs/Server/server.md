# Suppress Server
The suppress server is a wrapper around the `express.js` app object. To construct the server, you do not need any parameters. The server will be constructed with the default settings.

```js
const { SuppressServer } = require('ai.suppress.js');
const server = new SuppressServer();
```

## Methods
### `start()`
Starts the server. This method does not return anything and takes one optional parameter, `port`. If no port is specified, the server will start on port 3000.

```js
server.start(3000);
```

### `createEndpoint(path, method, generator)`
Creates an endpoint on the server. This method takes three parameters, `path`, `method`, and `generator`.

- `path` is the path of the endpoint. This can be a string or a regular expression.

- `method` is the HTTP method of the endpoint. This should be a string, with the value being one of `GET`, `POST`, `GET-db`, `POST-db`, `PUT-db`.

- `generator` is the generator function that will be called when the endpoint is hit. This should be the `DataGenerator` object.

```js
server.createEndpoint('/test', 'GET', generator);
```

### `mountDatabase(dataStorage)`
Mounts a database to the server. This method takes one parameter, `dataStorage`, which is the `DataStorage` object that will be mounted to the server. Learn more about the `DataStorage` object [here](../DataStorage/data-storage.md).


```js
server.mountDatabase(dataStorage);
```

## Customization
You can add custom endpoints and middleware to the server. To do this, you can access the `app` property of the server object. This is the `express.js` app object.

```js
server.app.get('/test', (req, res) => {
  res.send('Hello World!');
});
```

Middle-ware can be added in a similar way.

```js
server.app.use((req, res, next) => {
  console.log('Request received!');
  next();
});
```
