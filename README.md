hapi-promise [![Build Status](https://travis-ci.org/valet-io/hapi-promise.png?branch=0.0.1)](https://travis-ci.org/valet-io/hapi-promise)
============

A hapi plugin that allows you to return promises in your request handlers

## Usage

[Register the plugin](https://github.com/spumko/hapi/blob/master/docs/Reference.md#packrequirename-options-callback) first. Then, you can call `reply` from any handler with a promise. Example:

```javascript
server.route({
  method: 'GET'
  path: '/',
  handler: function (request, reply) {
    reply(promise);
  }
});
```

The plugin will automatically intercept all replies that are **thenables** (have a property `then` that is a function) and resolve them.

It also handles errors neatly. If you reject the promise with a [Hapi error](https://github.com/spumko/hapi/blob/master/docs/Reference.md#hapierror), that rejection will be sent as JSON as if you'd called reply directly with the error. For all other errors, an [internal error](https://github.com/spumko/hapi/blob/master/docs/Reference.md#internalmessage-data) will be sent. 

The following two snippets will behave identically: 

```javascript
function (request, reply) {
  reply(Hapi.error.notFound('Missing'));
}

function (request, reply) {
  var promise = new Promise(function (resolve, reject) {
    reject(Hapi.error.notFound('Missing'));
  });
  reply(promise);
}
```

But the following will return a generic 500 / Internal Server error: 

```javascript
function (request, reply) {
  var promise = new Promise(function (resolve, reject) {
    reject('Missing'));
  });
  reply(promise);
}
```

This pattern allows you to easily catch and recast anticipated errors from promise-based libraries while hiding unexpected exceptions from your API consumers.