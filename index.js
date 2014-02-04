'use strict';

module.exports = {
  name: require('./package.json').name,
  version: require('./package.json').version,
  register: function (plugin, options, next) {

    plugin.ext('onPreResponse', function (request, next) {
      var Hapi = plugin.hapi,
      response = request.response;

      if (response.variety === 'plain' && typeof response.source.then === 'function') {
        return response.source.then(function (res) {
          return next(res);
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