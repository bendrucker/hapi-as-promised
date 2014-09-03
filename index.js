'use strict';

module.exports = {
  name: require('./package.json').name,
  version: require('./package.json').version,
  register: function (plugin, options, next) {

    plugin.ext('onPreResponse', function (request, next) {
      var Hapi = plugin.hapi,
      response = request.response;

      if (response.variety === 'plain' && !!response.source && typeof response.source.then === 'function') {
        return response.source.then(function (res) {
          response.source = res;
          return next(response);
        }, function (err) {
          if (!err.isBoom) {
            err = Hapi.error.internal(err.message, err);
          }
          return next(err);
        });
      }

      next();
    });

    next();
  }
};