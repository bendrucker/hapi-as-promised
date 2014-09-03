hapi-as-promised [![Build Status](https://travis-ci.org/bendrucker/hapi-as-promised.svg?branch=master)](https://travis-ci.org/bendrucker/hapi-as-promised) [![NPM version](https://badge.fury.io/js/hapi-as-promised.png)](http://badge.fury.io/js/hapi-as-promised)
============

A hapi plugin that allows you to return promises in your request handlers. 

## Usage

```javascript
server.route({
  method: 'GET'
  path: '/',
  handler: function (request, reply) {
    reply(promise);
  }
});
```

The plugin will automatically intercept all replies that are **thenables** (have a property `then` that is a function) and resolve them. You can still chain methods to your reply like `code`. Only the reply body itself is modified. Error behavior is unchanged. A rejection with `err.isBoom === true` will be serialized and sent to the client, while all others will be transformed into 500s. 
