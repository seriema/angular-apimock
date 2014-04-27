/*! Angular API Mock v0.1.0
 * Licensed with MIT
 * Made with ♥ from Seriema + Redhorn */
/* Create the main module, 'apiMock'. It's the one that needs to be included in
   other projects. */
angular.module('apiMock', []).provider('apiMockDefaultImpl', function () {
  /* This is the default implementation of apiMock. It's driven by the maintainers
   goals, but can be overriden in apiMock.config(). The members are:
   'isApiPath' function: takes a `request` object and decides if the path
                         should be rerouted. Default: Checks the requested
                         URL for `apiPath` and returns true if it's the
                         beginning of the path.
   'reroutePath' function: takes a `request` object and replaces the URL with
                           the routed path. Default: Simply replaces `apiPath`
                           with `mockDataPath`, but adds the HTTP verb and
                           `.json` at the end of the path. A GET request to
                           '/api/user/5' turns into '/api/user/5.get.json'.
   'isGlobalMock' function: decides if mocking is enabled. Default: Checks
                           `$location` for a `apimock` variable and that it's set
                           to `true`.
   'isLocalMock' function: takes a `request` object and decides if mocking is
                           overriden. Default: checks the request object for a
                           `apimock` property set to `true`.
   'mockDataPath' string: the path to be rerouted to. Default: '/mock_data'.
   'apiPath' string: the path to be rerouted from. Default: '/api'. */
  var mockDataPath = '/mock_data';
  var apiPath = '/api';
  var $location;
  function isApiPath(req) {
    return req.url.indexOf(this.apiPath) === 0;
  }
  function isLocalMock(req) {
    return !!req.apiMock;
  }
  function isGlobalMock() {
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
  function reroutePath(req) {
    var path = req.url.substring(config.apiPath.length);
    req.url = config.mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
  }
  function shouldMock(req) {
    return (config.isGlobalMock() || config.isLocalMock(req)) && config.isApiPath(req);
  }
  var config = {
      mockDataPath: mockDataPath,
      apiPath: apiPath,
      isApiPath: isApiPath,
      isLocalMock: isLocalMock,
      isGlobalMock: isGlobalMock,
      reroutePath: reroutePath
    };
  function ApiMockDefaultImpl(_$location) {
    angular.extend(this, config);
    $location = _$location;
  }
  this.shouldMock = shouldMock;
  this.doMock = config.reroutePath;
  this.config = function (options) {
    angular.extend(config, options);
  };
  this.$get = [
    '$location',
    function ($location) {
      return new ApiMockDefaultImpl($location);
    }
  ];
}).provider('apiMock', function () {
  /* Helper-service that allows the httpInterceptor to be configured. It's
   basically a config-object that can have all it's members set to something
   user-defined. It works with to primary methods:
   'shouldMock' function: decides if the current request should be mocked.
   'doMock' function: does the actual mocking of the request.*/
  var config = {
      shouldMock: null,
      doMock: null
    };
  function ApiMock() {
    angular.extend(this, config);
  }
  this.config = function (options) {
    angular.extend(config, options);
  };
  this.$get = function () {
    return new ApiMock();
  };
}).service('httpInterceptor', [
  '$q',
  'apiMock',
  function ($q, apiMock) {
    /* The main service. Is jacked in as a interceptor on $http so it gets called
   on every http call. This allows us to do our magic. */
    this.request = function (req) {
      if (req && apiMock.shouldMock(req)) {
        apiMock.doMock(req);
      }
      return req || $q.when(req);
    };
  }
]).config([
  '$httpProvider',
  'apiMockProvider',
  'apiMockDefaultImplProvider',
  function ($httpProvider, apiMockProvider, apiMockDefaultImplProvider) {
    /* This is where the magic happens. Configure $httpProvider to use our
   httpInterceptor on all calls. It's what allows us to do automatic routing. */
    $httpProvider.interceptors.push('httpInterceptor');
    /* This sets the default behaviour of apiMock. */
    apiMockProvider.config({
      shouldMock: apiMockDefaultImplProvider.shouldMock,
      doMock: apiMockDefaultImplProvider.doMock
    });
  }
]);