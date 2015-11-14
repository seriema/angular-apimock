/*! Angular API Mock v0.3.3
 * Licensed with MIT
 * Made with ♥ from Seriema + Redhorn */
/* Create the main module, `apiMock`. It's the one that needs to be included in
 * your projects. E.g. `angular.module('myApp', ['apiMock'])`. You don't need
 * to do anything else, but you can configure the paths for api-calls and mock
 * data by calling `app.config(function (apiMockProvider) { ... });`.
 */
angular.module('apiMock', [])

	.config(['$httpProvider', function ($httpProvider) {
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
		var $filter;
		var config = {
			defaultMock: false,
			mockDataPath: '/mock_data',
			apiPath: '/api',
			disable: false,
			stripQueries: true,
			delay: 0
		};
		var fallbacks = [];

		// Helper methods
		//

		// TODO: IE8: remove when we drop IE8/Angular 1.2 support.
		// Object.keys isn't supported in IE8. Which we need to support as long as we support Angular 1.2.
		// This isn't a complete polyfill! It's just enough for what we need (and we don't need to bloat).
		function objectKeys(object) {
			var keys = [];

			angular.forEach(object, function (value, key) {
				keys.push(key);
			});

			return keys;
		}

		// TODO: IE8: remove when we drop IE8/Angular 1.2 support.
		// Date.prototype.toISOString isn't supported in IE8. Which we need to support as long as we support Angular 1.2.
		// Modified from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
		function toISOString(date) {
			function pad(number) {
				if (number < 10) {
					return '0' + number;
				}
				return number;
			}

			return date.getUTCFullYear() +
				'-' + pad(date.getUTCMonth() + 1) +
				'-' + pad(date.getUTCDate()) +
				'T' + pad(date.getUTCHours()) +
				'.' + pad(date.getUTCMinutes()) +
				'.' + pad(date.getUTCSeconds()) +
				'.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
				'Z';
		}

		// Taken as-is from Angular 1.4.x: https://github.com/angular/angular.js/blob/f13852c179ffd9ec18b7a94df27dec39eb5f19fc/src/Angular.js#L296
		function forEachSorted(obj, iterator, context) {
			var keys = objectKeys(obj).sort();
			for (var i = 0; i < keys.length; i++) {
				iterator.call(context, obj[keys[i]], keys[i]);
			}
			return keys;
		}

		// Modified from Angular 1.4.x: https://github.com/angular/angular.js/blob/929ec6ba5a60e926654583033a90aebe716123c0/src/ng/http.js#L18
		function serializeValue(v) {
			if (angular.isDate(v)) {
				return toISOString(v);
			}

			return v;
		}

		// Modified from Angular 1.4.x: https://github.com/angular/angular.js/blob/720012eab6fef5e075a1d6876dd2e508c8e95b73/src/ngResource/resource.js#L405
		function encodeUriQuery(val) {
			return encodeURIComponent(val).
			replace(/%40/gi, '@').
			replace(/%3A/gi, ':').
			replace(/%24/g, '$').
			replace(/%2C/gi, ',').
			replace(/%20/g, '+');
		}

		// TODO: replace with a $httpParamSerializerJQLikeProvider() call when we require Angular 1.4 (i.e. when we drop 1.2 and 1.3).
		// Modified from Angular 1.4.x: https://github.com/angular/angular.js/blob/929ec6ba5a60e926654583033a90aebe716123c0/src/ng/http.js#L108
		function jQueryLikeParamSerializer(params) {
			var parts = [];

			function serialize(toSerialize, prefix, topLevel) {
				if (angular.isArray(toSerialize)) {
					// Serialize arrays.
					angular.forEach(toSerialize, function (value, index) {
						serialize(value, prefix + '[' + (angular.isObject(value) ? index : '') + ']');
					});
				} else if (angular.isObject(toSerialize) && !angular.isDate(toSerialize)) {
					// Serialize objects (not dates, because that's covered by the default case).
					forEachSorted(toSerialize, function (value, key) {
						serialize(value, prefix +
						(topLevel ? '' : '[') +
						key +
						(topLevel ? '' : ']'));
					});
				} else if (toSerialize === undefined || toSerialize === '') {
					// Keep empty parameters as it still affects the mock file path.
					parts.push(encodeUriQuery(prefix));
				} else {
					// Serialize everything else (including dates).
					parts.push(encodeUriQuery(prefix) + '=' + encodeUriQuery(serializeValue(toSerialize)));
				}
			}

			serialize(params, '', true);
			return parts.join('&');
		}

		function queryStringToObject(paramString) {
			if (!paramString) {
				return {};
			}

			var paramArray = paramString.split('&');

			var result = {};
			angular.forEach(paramArray, function (param) {
				param = param.split('=');
				result[param[0]] = param[1] || '';
			});

			return result;
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

		function getParameter(req) {
			var mockValue = localMock(req);
			// Note: `false` is a valid option, so we can't use falsy-checks.
			if (mockValue === undefined) {
				mockValue = globalMock();
			}
			if (mockValue === undefined) {
				mockValue = config.defaultMock;
			}

			return mockValue;
		}

		function getCommand(mockValue) {
			// Depending how we got mockValue it might've been parsed into a type or not.
			switch ((mockValue || '').toString().toLowerCase()) {
				case '200':
				case '404':
				case '500':
					return { type: 'respond', value: parseInt(mockValue, 10) };

				case 'auto':
					return { type: 'recover' };

				case 'true':
					return { type: 'reroute' };
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
			return (apiPathMatched(url, config.apiPath) !== undefined);
		}

		function apiPathMatched(url, apiPath) {
			var match; // Lets initially assume undefined as no match

			if (angular.isArray(apiPath)) {
				angular.forEach(apiPath, function (path) {
					if (match) { return; } // Hack to skip more recursive calls if already matched
						var found = apiPathMatched(url, path);
					if (found) {
						match = found;
					}
				});
			}
			if (match) {
				return match;
			}
			if (apiPath instanceof RegExp) {
				if (apiPath.test(url)) {
					return apiPath;
				}
			}
			if ((url.toString().indexOf(apiPath) === 0)) {
				return apiPath;
			}
			return match;
		}

		function prepareFallback(req) {
			if (isApiPath(req.url)) {
				fallbacks.push(req);
			}
		}

		function removeFallback(res) {
			var startLength = fallbacks.length;
			fallbacks = $filter('filter')(fallbacks, {
				method: '!' + res.method,
				url: '!' + res.url
			}, true);

			return startLength > fallbacks.length;
		}

		function reroute(req) {
			if (!isApiPath(req.url)) {
				return req;
			}

			// replace apiPath with mockDataPath.
			var oldPath = req.url;

			var redirectedPath = req.url.replace(apiPathMatched(req.url, config.apiPath), config.mockDataPath);

			var split = redirectedPath.split('?');
			var newPath = split[0];
			var queries = split[1] || '';

			// query strings are stripped by default (like ?search=banana).
			if (!config.stripQueries) {

				//test if we have query params
				//if we do merge them on to the params object
				var queryParamsFromUrl = queryStringToObject(queries);
				var params = angular.extend(req.params || {}, queryParamsFromUrl);

				//test if there is already a trailing /
				if (newPath[newPath.length - 1] !== '/') {
					newPath += '/';
				}

				//serialize the param object to convert to string
				//and concatenate to the newPath
				newPath += angular.lowercase(jQueryLikeParamSerializer(params));
			}

			//Kill the params property so they aren't added back on to the end of the url
			req.params = undefined;

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

		function ApiMock(_$location, _$log, _$q, _$filter) {
			$location = _$location;
			$log = _$log;
			$q = _$q;
			$filter = _$filter;
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
				/* falls through */
				default:
					return req;
			}
		};

		p.onResponse = function (res) {
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

		this.$get = ['$location', '$log', '$q', '$filter', function ($location, $log, $q, $filter) {
			return new ApiMock($location, $log, $q, $filter);
		}];
	})

	.service('httpInterceptor', ['$injector', '$q', '$timeout', 'apiMock', function ($injector, $q, $timeout, apiMock) {
		/* The main service. Is jacked in as a interceptor on `$http` so it gets called
		 * on every http call. This allows us to do our magic. It uses the provider
		 * `apiMock` to determine if a mock should be done, then do the actual mocking.
		 */
		this.request = function (req) {
			return apiMock.onRequest(req);
		};

		this.response = function (res) {
			var deferred = $q.defer();

			$timeout(
				function () {
					// TODO: Apparently, no tests break regardless what this resolves to. Fix the tests!
					deferred.resolve(apiMock.onResponse(res));
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
						deferred.reject(rej);
					}
				},
				apiMock.getDelay(),
				true // Trigger a $digest.
			);

			return deferred.promise;
		};
	}]);
