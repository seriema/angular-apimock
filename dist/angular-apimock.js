/*! Angular API Mock v0.1.0
 * Licensed with MIT
 * Made with ♥ from Seriema + Redhorn */
angular.module('apiMock', []).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  }
]).factory('apiMock', [
  '$location',
  function ($location) {
    return {
      shouldReplace: function (req, apiPath) {
        return req.url.indexOf(apiPath) === 0;
      },
      replacePath: function (req, apiPath, mockDataPath) {
        var path = req.url.substring(apiPath.length);
        req.url = mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
      },
      isMocking: function () {
        var regex = /apimock/i;
        var found = false;
        angular.forEach($location.search(), function (value, key) {
          if (regex.test(key)) {
            // Update $location object with primitive boolean compatibility in case if string type.
            if (value === true || angular.lowercase(value) === 'true') {
              found = true;
              $location.search(key, null);
              $location.search('apimock', true);
            }
          }
        });
        return found;
      }
    };
  }
]).provider('httpInterceptor', function () {
  var config = {
      mockDataPath: '/mock_data',
      apiPath: '/api'
    };
  this.config = function (options) {
    angular.extend(config, options);
  };
  function HttpInterceptor($q, apiMock) {
    this.request = function (req) {
      if (req && apiMock.isMocking() && apiMock.shouldReplace(req, config.apiPath)) {
        apiMock.replacePath(req, config.apiPath, config.mockDataPath);
      }
      return req || $q.when(req);
    };
  }
  this.$get = [
    '$q',
    'apiMock',
    function ($q, apiMock) {
      return new HttpInterceptor($q, apiMock);
    }
  ];
});