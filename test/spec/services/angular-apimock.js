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

	it('should handle mixed case search paths', function () {
		location.search = '?apiMock=TRUE';
		expect(httpInterceptor.apiMocked).toBe(true);
	});
});
