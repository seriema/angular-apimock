'use strict';

angular.module('apiMock', [])

	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})

	.factory('mockSwitch', function() {
		return {
			mockApi: function() {
				return location.search.indexOf('apimock=true') > -1;
			}
		};
	})

	.factory('httpInterceptor', function ($q, mockSwitch) {
		var doMock = mockSwitch.mockApi(),
			config = {
				offlineDataPath: '/mock_data',
				apiPath: '/api'
			};

		return {
			request: function(req) {
				if (doMock && req) {
					if (req.url.indexOf(config.apiPath) === 0) {
						var path = req.url.substring(config.apiPath.length);
						req.url = config.offlineDataPath + path + '.' + req.method.toLowerCase() + '.json';
					}
				}

				return req || $q.when(req);
			},
			config: function(options) {
				angular.extend(config, options);
			}
		};
	}
);
