'use strict';

describe('Service: apiMock', function () {
  // instantiate service
  var httpInterceptor,
    $location;

  // load the service's module
  beforeEach(module('apiMock'));

  it('should exist', inject(function(_httpInterceptor_) {
    httpInterceptor = _httpInterceptor_;
    expect(!!httpInterceptor).toBe(true);
  }));

  it('should return true when apimock param is equal to true. (http://server/?apimock=true)', inject(function (_$location_, _httpInterceptor_) {
    var options,
      key,
      value;

    // Mockup the route and the query string and create an instance of the interceptor.
    $location = _$location_;
    httpInterceptor = _httpInterceptor_;

    // Define a valid query string.
    options = [
      {'apimock': true},
      {'apiMock': true},
      {'APIMOCK': true},
      {'ApiMock': true}
    ];

    angular.forEach(options, function(option) {
      key = Object.getOwnPropertyNames(option).pop();
      value = option[key];

      // Set location with the query string.
      $location.search(key, value);
      expect(httpInterceptor.apiMocked()).toBe(true);

      // Remove param tested from the location.
      $location.search(key, null);
    });

  }));

  it('should return false when apimock param is equal to false, or an object different of typeof boolean.', inject(function (_$location_, _httpInterceptor_) {
    var options,
      key,
      value;

    // Mockup the route and the query string and create an instance of the interceptor.
    $location = _$location_;
    httpInterceptor = _httpInterceptor_;

    // Define a NOT valid query string.
    options = [
      {'apimock': false},
      {'apimock': 'true'},
      {'apimock': 1},
      {'apimock': 'not valid'},
      {'apimock': 40}
    ];

    angular.forEach(options, function(option) {
      key = Object.getOwnPropertyNames(option).pop();
      value = option[key];

      // Set location with the query string.
      $location.search(key, value);
      expect(httpInterceptor.apiMocked()).toBe(false);

      // Remove param tested from the location.
      $location.search(key, null);
    });

  }));

  it('should return false when apimock param is not present in the query string. (http://server/)', inject(function (_httpInterceptor_) {
    // Create an instance of the interceptor.
    httpInterceptor = _httpInterceptor_;
    expect(httpInterceptor.apiMocked()).toBe(false);
  }));

});
