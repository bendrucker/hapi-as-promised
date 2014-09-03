'use strict';

var Lab      = require('lab');
var lab      = exports.lab = Lab.script();
var describe = lab.describe;
var it       = lab.it;
var before   = lab.before;
var expect   = Lab.expect;
var Promise  = require('bluebird');
var hapi     = require('hapi');


describe('hapi-as-promised', function () {

  var server;
  before(function (done) {
    server = new hapi.Server();
    server.pack.register(require('./'), done);
  });

  it('ignores non-thenable replies', function (done) {
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

  it('ignores empty replies', function (done) {
    server.route({
      method: 'GET',
      path: '/empty',
      handler: function (request, reply) {
        reply();
      }
    });

    server.inject('/empty', function (response) {
      expect(response.result).to.equal(null);
      done();
    });
  });

  it('handles promises that resolve', function (done) {
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

  it('handles promises that reject', function (done) {
    var err = hapi.error.forbidden();
    server.route({
      method: 'GET',
      path: '/error',
      handler: function (request, reply) {
        // Use a fake rejecting thenable b/c Bluebird's unhandled detection
        // catches a normal rejection
        reply({
          then: function () {
            return Promise.reject(err);
          }
        });
      }
    });

    server.inject('/error', function (response) {
      expect(response.statusCode).to.equal(403);
      expect(response.result).to.have.property('error', err.message);
      done();
    });
  });

});
