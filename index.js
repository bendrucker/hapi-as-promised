'use strict';

module.exports = {
  name: require('./package.json').name,
  version: require('./package.json').version,
  register: function (plugin, options, next) {

    plugin.ext('onPreResponse', function (request, reply) {
      var Hapi = plugin.hapi,
      response = request.response();

      if (response.variety === 'plain' && typeof response.raw.then === 'function') {
        return response.then(function (res) {
          return reply(res);
        }, function (err) {
          if (!(err instanceof Hapi.error)) {
            err = Hapi.error.internal(err.message, err);
          }
          return reply(err);
        });
      }

      reply();
    });

    next();
  }
};