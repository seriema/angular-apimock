/*! Angular API Mock v0.1.0
 * Licensed with MIT
 * Made with ♥ from Seriema + Redhorn */
angular.module('apiMock', []).config([
  '$httpProvider',
  function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  }
]).factory('mockSwitch', function () {
  return {
    mockApi: function () {
      return location.search.toLowerCase().indexOf('apimock=true') > -1;
    }
  };
}).provider('httpInterceptor', function () {
  var config = {
      mockDataPath: '/mock_data',
      apiPath: '/api'
    };
  this.config = function (options) {
    angular.extend(config, options);
  };
  function HttpInterceptor($q, mockSwitch) {
    var doMock = mockSwitch.mockApi();
    this.apiMocked = mockSwitch.mockApi;
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
  this.$get = [
    '$q',
    'mockSwitch',
    function ($q, mockSwitch) {
      return new HttpInterceptor($q, mockSwitch);
    }
  ];
});