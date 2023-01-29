module.exports =
{
    "database": {
        "add": {
            "collectionChoice": (data, task, collections) => {
                collections = collections.join(", ");
                return `Data:\n${JSON.stringify(data)}\nThe above data was sent under the url: ${task}\nInto which of the following collections should the above data be inserted?\nThe collections available are: ${collections}\nIf none, create a new collection name.\nCollection:`;

                // return `${data}\nA server has recieved a POST request with the above data. The post request URL was '${task}'. The server has the following database collections: ${collections}.\nChoose one of the collections into which the data should be added. If none of the collections should contain the data, create a new name for a collection.\n Collection name as a simple string:`
            }
        },
        "get": {
            "collectionChoice": (path, collections) => {
                collections = collections.join(", ");
                return `A server has recieved a GET request. The get request URL was '${path}'. The server has the following database collections: ${collections}.\nChoose one of the collections from which the data should be retrieved. If none of the collections should contain the data, return 'cannot identify collection'.\n Collection name as a simple string:`
            },
            "query": (path, keys) => {
                // we now want to get the string to query the mongodb database and find the values in the path. We have the keys of the objects stored in the database, and the path. We want to get the values of the path that correspond to the keys.
                return `A server has recieved a GET request to query a database. The get request URL was '${path}'. In the database, objects are stored with the following keys: ${keys}.\nCreate a stringified mongodb query JSON.\nQuery has to be done using the minimal number of query parameters. If the query is not possible, return 'cannot identify query'.\nDo not wrap the JSON in any punctuation. Query as a stringified JSON:`
            }
        },
        "put": {
            "collectionChoice": (path, collections) => {
                collections = collections.join(", ");
                return `A server has recieved a PUT request. The put request URL was '${path}'. The server has the following database collections: ${collections}.\nChoose one of the collections from which the data should be retrieved. If none of the collections should contain the data, return 'cannot identify collection'.\n Collection name as a simple string:`
            },
            "update": (path, data, keys) => {
                return `A server has recieved a PUT request.\nData to update: ${JSON.stringify(data)}\nThe request URL was '${path}'. In the database objects are stored with the following keys: ${keys}.\nCreate a stringified mongodb update JSON. The JSON must include atomic operators.\nDo not wrap the JSON in any punctuation. Do not include the filter JSON.\nUpdate JSON as a stringified JSON:`

            },
            "atomicCheck": (query) => {
                return `${query}\nThe above json is an update statement for a mongodb document. Return true if this json contains the correct atomic statements to create an update in the database, if not: create a new statement using the provided data, which makes use of atomic operators.\ntrue or corrected statement:`
            },
            "filter": (path, data, keys) => {
                return `A server has recieved a PUT request.\nData to update: ${JSON.stringify(data)}\nThe request URL was '${path}'. In the database objects are stored with the following keys: ${keys}.\nCreate a stringified mongodb filtering JSON.\nDo not wrap the JSON in any punctuation. Do not include the data update JSON.Filter as a stringified JSON:`
            }
        }
    }
}
