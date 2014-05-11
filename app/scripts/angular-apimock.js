/* Create the main module, `apiMock`. It's the one that needs to be included in
   your projects. E.g. `angular.module('myApp', ['apiMock'])`. You don't need
   to do anything else, but you can configure the paths for api-calls and mock
   data by calling `.config(apiMockProvider)`.
*/
angular.module('apiMock', [])

.config(function ($httpProvider) {
/* This is where the magic happens. Configure `$http` to use our
   `httpInterceptor` on all calls. It's what allows us to do automatic routing.
*/
  $httpProvider.interceptors.push('httpInterceptor');
})

.provider('apiMock', function () {
/* This is the Provider for apiMock. It's used by `httpInterceptor` to determine
   when and how to do the mocking (routing).

   Config options:
   `mockDataPath` string: the path to be rerouted to. Default: `/mock_data`.
   `apiPath` string: the path to be rerouted from. Default: `/api`.

   Public interface:
   `shouldMock' method: takes a `request` object and decides if mocking should
                        be done on this request. It checks global and local
                        apiMock flags to see if it should mock. It also checks
                        the request URL if it starts with `apiPath`.
   `doMock` method: takes a `request` object and modifies it. Specifically it
                    changes the request URL to the `mockDataPath`. It also
                    appends the HTTP verb and .json to the path. Note: query
                    parameters (e.g. ?search=banana) are stripped. A GET
                    request to `/api/user/5?option=full` turns into
                    `/mock_data/user/5.get.json`.

   Private members:
   `_isApiPath` method: takes a `request` object and checks the requested
                        URL for `apiPath` and returns true if it's the
                        beginning of the path.
   `_isGlobalMock` method: decides if mocking is enabled by checking
                           `$location` for query parameter `apimock` and that
                           it's set to `true` or a status code.
                           E.g. `?apimock=true`.
   `_isLocalMock` method: takes a `request` object and decides if mocking is
                          overriden by checking the request object for a
                          `apimock` property set to `true` or a status code.
*/
  var mockDataPath = '/mock_data';
  var apiPath = '/api';
  var $location;
	var $q;

	function determineMock(obj) {
		switch (typeof obj) {
			case 'undefined':
				return undefined;

			case 'number':
				return isNaN(obj) || obj === 0 ? false : obj;

			default:
				return !!obj;
		}
	}

	function httpStatusResponse(req) {
		var response = {
			status: req.apiMock,
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Server': 'Angular ApiMock'
			}
		};
		return $q.reject(response);
	}

	function mockDataResponse(req) {
		// replace apiPath with mockDataPath.
		var path = req.url.substring(config.apiPath.length);
		req.url = config.mockDataPath + path;

		// strip query strings (like ?search=banana).
		var regex = /[a-zA-z0-9/.\-]*/;
		req.url = regex.exec(req.url)[0];

		// add file endings (method verb and .json).
		if (req.url[req.url.length - 1] === '/') {
			req.url = req.url.slice(0, -1);
		}
		req.url += '.' + req.method.toLowerCase() + '.json';

		return req;
	}

	function ApiMock(_$location, _$q) {
    $location = _$location;
		$q = _$q;
  }

  var p = ApiMock.prototype;

  p.shouldMock = function (req) {
		if (req === undefined) {
			return !!this._isGlobalMock();
		}

		var mock = this._isLocalMock(req);
		if (mock === undefined) {
			mock = !!this._isGlobalMock();
		}
    return mock && this._isApiPath(req);
  };

	p.doMock = function (req) {
		if (req && typeof req.apiMock === 'number') {
			return httpStatusResponse(req);
		}
		return mockDataResponse(req);
	};

  p._isApiPath = function (req) {
    return req && req.url.indexOf(config.apiPath) === 0;
  };

  p._isLocalMock = function (req) {
		return req && determineMock(req.apiMock);
  };

  p._isGlobalMock = function () {
    var regex = /apimock/i;
		var result;

    angular.forEach($location.search(), function(value, key) {
      if (regex.test(key)) {
				result = determineMock(value);
      }
    });

    return result;
  };

  var config = {
    mockDataPath: mockDataPath,
    apiPath: apiPath
  };

  this.config = function (options) {
    angular.extend(config, options);
  };

  this.$get = function ($location, $q) {
    return new ApiMock($location, $q);
  };
})

.service('httpInterceptor', function($q, apiMock) {
/* The main service. Is jacked in as a interceptor on `$http` so it gets called
   on every http call. This allows us to do our magic. It uses the provider
   `apiMock` to determine if a mock should be done, then do the actual mocking.
*/
  this.request = function (req) {
    if (req && apiMock.shouldMock(req)) {
      req = apiMock.doMock(req);
    }

		// Return the request or promise.
    return req || $q.when(req);
  };
});
