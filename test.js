describe('Hapi Promise', function () {
  it('leaves requests that do not return promises untouched');
  it('replies with the resolution of a promise');
  it('replies with a Hapi.error rejection');
  it('casts any other rejection into a Hapi.error.internal');
});