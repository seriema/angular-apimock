'use strict';

describe('Service: apiMock', function () {

  // load the service's module
  beforeEach(module('apiMock'));

  // instantiate service
  var httpInterceptor;
  beforeEach(inject(function (_httpInterceptor_) {
	  httpInterceptor = _httpInterceptor_;
  }));

  it('should exist', function () {
    expect(!!httpInterceptor).toBe(true);
  });
});
