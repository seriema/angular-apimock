/* Create the main module, `apiMock`. It's the one that needs to be included in
 * your projects. E.g. `angular.module('myApp', ['apiMock'])`. You don't need
 * to do anything else, but you can configure the paths for api-calls and mock
 * data by calling `app.config(function (apiMockProvider) { ... });`.
 */
angular.module('apiMock', [])

	.config(function ($httpProvider) {
		/* This is where the magic happens. Configure `$http` to use our
		 `httpInterceptor` on all calls. It's what allows us to do automatic routing.
		 */
		$httpProvider.interceptors.push('httpInterceptor');
	})

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
		 *   be done on this request. It checks global and local apiMock flags to see
		 *   if it should mock. It also checks the request URL if it starts with `apiPath`.
		 *   If the request is to have a `recover` attempt it's put in the fallbacks list.
		 *   A GET request to `/api/user/5?option=full` turns into `/mock_data/user/5.get.json`.
		 * `onResponse` method: takes a `request` object and simply removes it from list
		 *   of fallbacks for `recover`.
		 * `recover` method: if request has been marked for recover `onRequest` then it
		 *   will reroute to mock data. This is only to be called on response error.
		 *
		 * Private members:
		 * `_countFallbacks` method: returns the current number of fallbacks in queue.
		 *   Only used for unit testing.
		 */

		// Helper objects
		//

		var mockDataPath = '/mock_data';
		var apiPath = '/api';
		var $location;
		var $q;
		var fallbacks = [];

		// Helper methods
		//

		function httpStatusResponse(status) {
			var response = {
				status: status,
				headers: {
					'Content-Type': 'text/html; charset=utf-8',
					'Server': 'Angular ApiMock'
				}
			};
			return $q.reject(response);
		}

		function getParameter(req) {
			var mockValue = localMock(req);
			if (mockValue === undefined) {
				mockValue = globalMock();
			}

			return mockValue;
		}

		function reroute(req) {
			if (!isApiPath(req.url)) {
				return req;
			}

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

		function globalMock() {
			return detectParameter($location.search());
		}

		function getCommand(mockValue) {
			switch (typeof mockValue) {
				case 'number':
					if (mockValue !== 0) {
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

		var prepareFallback = function (req) {
			if (isApiPath(req.url)) {
				fallbacks.push(req);
			}
		};

		var removeFallback = function (res) {
			var found = false;
			angular.forEach(fallbacks, function (fallback, index) {
				if (fallback.method === res.method && fallback.url === res.url) {
					found = true;
					fallbacks.splice(index, 1);
				}
			});

			return found;
		};

		var isApiPath = function (url) {
			return url.indexOf(config.apiPath) === 0;
		};

		function ApiMock(_$location, _$q) {
			$location = _$location;
			$q = _$q;
		}

		// Expose public interface for provider instance
		//

		var p = ApiMock.prototype;

		p._countFallbacks = function () {
			return fallbacks.length;
		};

		p.onRequest = function (req) {
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
			removeFallback(res);
			return res;
		};

		p.recover = function (rej) {
			if (rej.config === undefined) {// Why is this called with regular response object sometimes?
				return false;
			}

			if (removeFallback(rej.config)) {
				return reroute(rej.config);
			}

			return false;
		};

		var config = {
			mockDataPath: mockDataPath,
			apiPath: apiPath
		};


		// Expose Provider interface
		//

		this.config = function (options) {
			angular.extend(config, options);
		};

		this.$get = function ($location, $q) {
			return new ApiMock($location, $q);
		};
	})

	.service('httpInterceptor', function($q, apiMock) {
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
			res = apiMock.onResponse(res);

			return res || $q.when(res);
		};

		this.responseError = function (rej) {
			return apiMock.recover(rej) || $q.reject(rej);
		};
	});
