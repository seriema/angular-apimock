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

  function HttpInterceptor($q, apiMock) {
    var doMock = apiMock.isMocking();

    this.request = function (req) {
      if (doMock && req) {
        if (req.url.indexOf(config.apiPath) === 0) {
          var path = req.url.substring(config.apiPath.length);
          req.url = config.mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
        }
      }

      return req || $q.when(req);
    };
  }

  this.$get = function ($q, apiMock) {
    return new HttpInterceptor($q, apiMock);
  };
});
