angular.module('apiMock', [])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
})

.factory('apiMock', function() {
  return {
    isMocking: function() {
      return location.search.toLowerCase().indexOf('apimock=true') > -1 ||
      location.hash.toLowerCase().indexOf('apimock=true') > -1;
    }
  };
})

.provider('httpInterceptor', function() {
  var config = {
    mockDataPath: '/mock_data',
    apiPath: '/api'
  };

  this.config = function (options) {
    angular.extend(config, options);
  };

  function shouldReplace(req, apiPath) {
    return req.url.indexOf(apiPath) === 0;
  }

  function replacePath(req, apiPath, mockDataPath) {
    var path = req.url.substring(apiPath.length);
    req.url = mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
  }

  function HttpInterceptor($q, apiMock) {
    var doMock = apiMock.isMocking();

    this.request = function (req) {
      if (doMock && req && shouldReplace(req, config.apiPath)) {
        replacePath(req, config.apiPath, config.mockDataPath);
      }

      return req || $q.when(req);
    };
  }

  this.$get = function ($q, apiMock) {
    return new HttpInterceptor($q, apiMock);
  };
});
