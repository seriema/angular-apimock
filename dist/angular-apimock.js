/*! Angular API Mock v0.1.8
 * Licensed with MIT
 * Made with ♥ from Seriema + Redhorn */
/* Create the main module, `apiMock`. It's the one that needs to be included in
 * your projects. E.g. `angular.module('myApp', ['apiMock'])`. You don't need
 * to do anything else, but you can configure the paths for api-calls and mock
 * data by calling `app.config(function (apiMockProvider) { ... });`.
 */
angular.module('apiMock', [])

	.config(["$httpProvider", function ($httpProvider) {
		/* This is where the magic happens. Configure `$http` to use our
		 `httpInterceptor` on all calls. It's what allows us to do automatic routing.
		 */
		$httpProvider.interceptors.push('httpInterceptor');
	}])

	.provider('apiMock', function () {
		/* This is the Provider for apiMock. It's used by `httpInterceptor` to support
		 * mocking.
		 *
		 * Config options:
		 * `mockDataPath` string: the path to be rerouted to. Default: `/mock_data`.
		 * `apiPath` string: the path to be rerouted from. Default: `/api`.
		 *
		 * Public interface:
		 * `onRequest` method: takes a `request` object and decides if mocking should
		 *	 be done on this request. It checks global and local apiMock flags to see
		 *	 if it should mock. It also checks the request URL if it starts with `apiPath`.
		 *	 If the request is to have a `recover` attempt it's put in the fallbacks list.
		 *	 A GET request to `/api/user/5?option=full` turns into `/mock_data/user/5.get.json`.
		 * `onResponse` method: takes a `request` object and simply removes it from list
		 *	 of fallbacks for `recover`.
		 * `recover` method: if request has been marked for recover `onRequest` then it
		 *	 will reroute to mock data. This is only to be called on response error.
		 *
		 * Private members:
		 * `_countFallbacks` method: returns the current number of fallbacks in queue.
		 *	 Only used for unit testing.
		 */

		// Helper objects
		//

		var $location;
		var $log;
		var $q;
		var config = {
			mockDataPath: '/mock_data',
			apiPath: '/api',
			disable: false,
			delay: 0
		};
		var fallbacks = [];

		// Helper methods
		//

		function detectParameter(keys) {
			var regex = /apimock/i;
			var result;

			angular.forEach(keys, function (value, key) {
				if (regex.test(key)) {
					result = value;
				}
			});

			return result;
		}

		function localMock(req) {
			return detectParameter(req);
		}

		function getParameter(req) {
			var mockValue = localMock(req);
			if (mockValue === undefined) {
				mockValue = globalMock();
			}

			return mockValue;
		}

		function getCommand(mockValue) {
			switch (typeof mockValue) {
				case 'number':
					if (mockValue !== 0 && !isNaN(mockValue)) {
						return { type: 'respond', value: mockValue };
					}
					break;

				case 'string':
					switch(mockValue.toLowerCase()) {
						case 'auto':
							return { type: 'recover' };
						case 'true':
							return { type: 'reroute' };
					}
					break;

				case 'boolean':
					if (mockValue === true) {
						return { type: 'reroute' };
					}
					break;
			}

			return { type: 'ignore' };
		}


		function globalMock() {
			return detectParameter($location.search());
		}

		function httpStatusResponse(status) {
			var response = {
				status: status,
				headers: {
					'Content-Type': 'text/html; charset=utf-8',
					'Server': 'Angular ApiMock'
				}
			};
			$log.info('apiMock: mocking HTTP status to ' + status);
			return $q.reject(response);
		}

		function isApiPath(url) {
			return url.indexOf(config.apiPath) === 0;
		}

		function prepareFallback(req) {
			if (isApiPath(req.url)) {
				fallbacks.push(req);
			}
		}

		function removeFallback(res) {
			var found = false;
			angular.forEach(fallbacks, function (fallback, index) {
				if (fallback.method === res.method && fallback.url === res.url) {
					found = true;
					fallbacks.splice(index, 1);
				}
			});

			return found;
		}

		function reroute(req) {
			if (!isApiPath(req.url)) {
				return req;
			}

			// replace apiPath with mockDataPath.
			var oldPath = req.url;
			var newPath = req.url.substring(config.apiPath.length);
			newPath = config.mockDataPath + newPath;

			// strip query strings (like ?search=banana).
			var regex = /[a-zA-z0-9/.\-]*/;
			newPath = regex.exec(newPath)[0];

			// add file endings (method verb and .json).
			if (newPath[newPath.length - 1] === '/') {
				newPath = newPath.slice(0, -1);
			}
			newPath += '.' + req.method.toLowerCase() + '.json';

			req.method = 'GET';
			req.url = newPath;
			$log.info('apiMock: rerouting ' + oldPath + ' to ' + newPath);

			return req;
		}

		// Expose public interface for provider instance
		//

		function ApiMock(_$location, _$log, _$q) {
			$location = _$location;
			$log = _$log;
			$q = _$q;
		}

		var p = ApiMock.prototype;

		p._countFallbacks = function () {
			return fallbacks.length;
		};

		p.getDelay = function () {
			return config.delay;
		};

		p.onRequest = function (req) {
			if (config.disable) {
				return req;
			}

			var param = getParameter(req);
			var command = getCommand(param);

			switch (command.type) {
				case 'reroute':
					return reroute(req);
				case 'recover':
					prepareFallback(req);
					return req;
				case 'respond':
					return httpStatusResponse(command.value);
				case 'ignore':
					return req;

				default:
					return req;
			}
		};

		p.onResponse = function (res) {
			if (config.disable) {
				return res;
			}

			removeFallback(res);
			return res;
		};

		p.recover = function (rej) {
			if (config.disable) {
				return false;
			}

			if (rej.config === undefined) {// Why is this called with regular response object sometimes?
				return false;
			}

			if (removeFallback(rej.config)) {
				$log.info('apiMock: recovering from failure at ' + rej.config.url);
				return reroute(rej.config);
			}

			return false;
		};

		// Expose Provider interface
		//

		this.config = function (options) {
			angular.extend(config, options);
		};

		this.$get = ["$location", "$log", "$q", function ($location, $log, $q) {
			return new ApiMock($location, $log, $q);
		}];
	})

	.service('httpInterceptor', ["$injector", "$q", "$timeout", "apiMock", function($injector, $q, $timeout, apiMock) {
		/* The main service. Is jacked in as a interceptor on `$http` so it gets called
		 * on every http call. This allows us to do our magic. It uses the provider
		 * `apiMock` to determine if a mock should be done, then do the actual mocking.
		 */
		this.request = function (req) {
			req = apiMock.onRequest(req);

			// Return the request or promise.
			return req || $q.when(req);
		};

		this.response = function (res) {
			var deferred = $q.defer();

			$timeout(
				function() {
					deferred.resolve( apiMock.onResponse(res) ); // TODO: Apparently, no tests break regardless what this resolves to. Fix the tests!
				},
				apiMock.getDelay(),
				true // Trigger a $digest.
			);

			return deferred.promise;
		};

		this.responseError = function (rej) {
			var deferred = $q.defer();

			$timeout(
				function () {
					var recover = apiMock.recover(rej);

					if (recover) {
						var $http = $injector.get('$http');
						$http(recover).then(function (data) {
							deferred.resolve(data);
						});
					} else {
						deferred.reject( rej );
					}
				},
				apiMock.getDelay(),
				true // Trigger a $digest.
			);

			return deferred.promise;
		};
	}]);
