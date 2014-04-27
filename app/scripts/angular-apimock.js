/* Create the main module, 'apiMock'. It's the one that needs to be included in
   other projects. */
angular.module('apiMock', [])

.config(function ($httpProvider) {
/* This is where the magic happens. Configure $httpProvider to use our
   httpInterceptor on all calls. It's what allows us to do automatic routing. */
  $httpProvider.interceptors.push('httpInterceptor');
})

.provider('apiMock', function() {
/* Helper-service that allows the httpInterceptor to be configured. It's
   basically a config-object that can have all it's members set to something
   user-defined. They are:
   'shouldReplace' function: takes a `request` object and decides if the path
                             should be rerouted. Default: Checks the requested
                             URL for `apiPath` and returns true if it's the
                             beginning of the path.
   'replacePath' function: takes a `request` object and replaces the URL with
                           the routed path. Default: Simply replaces `apiPath`
                           with `mockDataPath`, but adds the HTTP verb and
                           `.json` at the end of the path. A GET request to
                           '/api/user/5' turns into '/api/user/5.get.json'.
   'isMocking' function: decides if mocking is enabled. Default: Checks
                         `$location` for a `apimock` variable and that it's set
                         to `true`.
   'mockDataPath' string: the path to be rerouted to. Default: '/mock_data'.
   'apiPath' string: the path to be rerouted from. Default: '/api'. */
  var $location;

  function shouldReplace(req) {
    return req.url.indexOf(config.apiPath) === 0;
  }

  function replacePath(req) {
    var path = req.url.substring(config.apiPath.length);
    req.url = config.mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
  }

  function isMocking() {
    var regex = /apimock/i;
    var found = false;

    // Check property.
    if (this.doMock) {
      angular.forEach($location.search(), function(value, key) {
        if (regex.test(key)) {
          // Update $location object with primitive boolean compatibility in case if string type.
          if (value === true || angular.lowercase(value) === 'true') {
            found = true;
            $location.search(key, null);
            $location.search('apimock', true);
          }
        }
      });
    }


    return found;
  }

  var config = {
    mockDataPath: '/mock_data',
    apiPath: '/api',
    shouldReplace: shouldReplace,
    replacePath: replacePath,
    isMocking: isMocking
  };

  /**
   * Constructor
   *
   * @param _$location
   * @constructor
   */
  function ApiMock(_$location) {
    angular.extend(this, config);
    $location = _$location;
  }

  /**
   * Indicate if the request are configure to
   * do api mocking.
   *
   * By default the apimock always is do it.
   *
   * @type {boolean}
   * @private
   */
  ApiMock.prototype.doMock = true;

  /**
   * Indicate if the request will be mocked or no. Using the property set
   * in the config object of $http service.
   *
   * - example:
   *
   *   $http({
   *     method: 'GET'
   *     url: '/people'
   *     apiMock: false
   *   })
   *
   * @param doMock
   *   {boolean}
   * @private
   */
  ApiMock.prototype.requestMockConfig = function(doMock) {
    this.doMock = (angular.isUndefined(doMock)) ? true : doMock;
  };

  this.config = function (options) {
    angular.extend(config, options);
  };

  this.$get = function ($location) {
    return new ApiMock($location);
  };
})

.service('httpInterceptor', function($q, apiMock) {
/* The main service. Is jacked in as a interceptor on $http so it gets called
   on every http call. This allows us to do our magic. */
  this.request = function (req) {
    // Load the configuration in the $http request.
    apiMock.requestMockConfig(req.apiMock);

    if (req && apiMock.isMocking() && apiMock.shouldReplace(req)) {
      apiMock.replacePath(req);
    }

    return req || $q.when(req);
  };
});
