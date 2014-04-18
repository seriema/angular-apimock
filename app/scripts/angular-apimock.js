angular.module('apiMock', [])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
})

.factory('apiMock', function($location) {
  return {
    isMocking: function() {
      var regex = /apimock/i,
          param = null;

      angular.forEach($location.search(), function(value, key) {
        if (regex.test(key)) {
          param = key;
          // Update $location object with primitive boolean compatibility in case if string type.
          value = angular.lowercase(value);
          if (value === 'true') {
            $location.search(key, !!value);
          }

        }
      });

      return !!$location.search()[param] && typeof $location.search()[param] === 'boolean';
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
