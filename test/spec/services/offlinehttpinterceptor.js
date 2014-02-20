'use strict';

describe('Service: offlineHttpInterceptor', function () {

  // load the service's module
  beforeEach(module('angularOfflineApp'));

  // instantiate service
  var offlineHttpInterceptor;
  beforeEach(inject(function (_offlineHttpInterceptor_) {
    offlineHttpInterceptor = _offlineHttpInterceptor_;
  }));

  it('should do something', function () {
    expect(!!offlineHttpInterceptor).toBe(true);
  });

});
