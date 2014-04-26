angular.module('apiMock', [])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('httpInterceptor');
})

.provider('apiMock', function() {
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
  this.request = function (req) {
    // Load the configuration in the $http request.
    apiMock.requestMockConfig(req.apiMock);

    if (req && apiMock.isMocking() && apiMock.shouldReplace(req)) {
      apiMock.replacePath(req);
    }

    return req || $q.when(req);
  };
});
