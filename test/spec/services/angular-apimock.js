'use strict';

describe('Service: apiMock', function () {

  // load the service's module
  beforeEach(module('apiMock'));

  // instantiate service
  var httpInterceptor,
    $location;
  beforeEach(inject(function (_httpInterceptor_, _$location_) {
	  httpInterceptor = _httpInterceptor_;
    $location = _$location_;
  }));

  it('should exist', function () {
    expect(!!httpInterceptor).toBe(true);
  });

  it('should return false when apimock param is not present', function () {
    $location.path('#/');
    console.log('httpInterceptor.apiMocked: ', $location.path(), httpInterceptor.apiMocked, $location.search().apimock);
    expect(httpInterceptor.apiMocked).toBe(false);
  });

/*
	it('should handle mixed case search paths', function () {
		location.search = '?apiMock=TRUE';
		expect(httpInterceptor.apiMocked).toBe(true);
	});*/
});
