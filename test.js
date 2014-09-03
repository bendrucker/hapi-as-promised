var Lab         = require('lab'),
    describe    = Lab.experiment,
    it          = Lab.test,
    expect      = Lab.expect,
    before      = Lab.before,
    after       = Lab.after;

var Promise     = require('bluebird');

var Hapi        = require('hapi'),
    hapiPromise = require('./');


describe('Hapi Promise', function () {

  var server;

  before(function (done) {
    server = new Hapi.Server(8100)
    server.pack.register(hapiPromise, function () {});
    server.start(done);
  });

  after(function (done) {
    server.stop(done);
  });

  it('leaves requests that do not return promises untouched', function (done) {
    server.route({
      method: 'GET',
      path: '/default',
      handler: function (request, reply) {
        reply('Normal response');
      }
    });

    server.inject('/default', function (response) {
      expect(response.result).to.equal('Normal response');
      done();
    });
  });

  it('replies with the resolution of a promise', function (done) {
    server.route({
      method: 'GET',
      path: '/resolve',
      handler: function (request, reply) {
        reply(Promise.resolve('Promised response')).code(201);
      }
    });

    server.inject('/resolve', function (response) {
      expect(response.result).to.equal('Promised response');
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('replies with a redirect', function (done) {
    server.route({
      method: 'GET',
      path: '/redirect',
      handler: function (request, reply) {
        reply.redirect('/foo');
      }
    });

    server.inject('/redirect', function (response) {
      expect(response.statusCode).to.equal(302);
      done();
    });
  });

  it('replies with a Hapi.error rejection', function (done) {
    server.route({
      method: 'GET',
      path: '/error/boom',
      handler: function (request, reply) {
        reply(Promise.reject(Hapi.error.notFound('Typed rejection'))).code(202);
      }
    });

    server.inject('/error/boom', function (response) {
      expect(response.statusCode).to.not.equal(202);
      expect(response.result).to.have.property('message', 'Typed rejection');
      done();
    });
  });
  it('casts any other rejection into a Hapi.error.internal', function (done) {
    server.route({
      method: 'GET',
      path: '/error/generic',
      handler: function (request, reply) {
        reply(Promise.reject('Generic'));
      }
    });

    server.inject('/error/generic', function (response) {
      expect(response.result).to.have.property('statusCode', 500);
      expect(response.result).to.have.property('message', 'An internal server error occurred');
      done();
    });
  });
});