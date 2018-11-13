hapi-as-promised [![Build Status](https://travis-ci.org/bendrucker/hapi-as-promised.svg?branch=master)](https://travis-ci.org/bendrucker/hapi-as-promised) [![NPM version](https://badge.fury.io/js/hapi-as-promised.svg)](http://badge.fury.io/js/hapi-as-promised) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/hapi-as-promised.svg)](https://greenkeeper.io/)
============

Handle promises passed to `reply` with a promise in Hapi 6 or 7. Hapi 8 adds native [promise support to `reply`](http://hapijs.com/api#replyerr-result), inspired by hapi-as-promised.

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
