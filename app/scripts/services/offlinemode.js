'use strict';

angular.module('offlineMode', [])
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})
	.factory('httpInterceptor', function ($q) {

		var OFFLINE = location.search.indexOf('offline=true') > -1,
			config = {
			offlineDataPath: '/offline_data',
			apiPath: '/api'
		};

		return {
			request: function(req) {
				if (OFFLINE && req) {
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
