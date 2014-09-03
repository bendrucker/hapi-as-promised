'use strict';

exports.register = function (plugin, options, next) {

  plugin.ext('onPreResponse', function (request, reply) {
    var res = request.response;
    if (res.source && typeof res.source.then === 'function') {
      return res.source
        .then(function (value) {
          res.source = value;
          return res;
        })
        .catch(function (err) {
          throw err;
        })
        .then(reply, reply);
    }
    reply();
  });

  next();

};

exports.register.attributes = {
  pkg: require('./package.json')
}
