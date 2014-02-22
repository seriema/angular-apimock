'use strict';

angular.module('offlineMode', [])
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})
	.factory('httpInterceptor', function ($q) {

		var OFFLINE = location.search.indexOf('offline=true') > -1,
			_config = {
			OFFLINE_DATA_PATH: '/offline_data',
			API_PATH: '/api'
		};

		return {
			request: function(req) {
				if (OFFLINE && req) {
					if (req.url.indexOf(_config.API_PATH) === 0) {
						var path = req.url.substring(_config.API_PATH.length);
						req.url = _config.OFFLINE_DATA_PATH + path + '.' + req.method.toLowerCase() + '.json';
					}
				}

				return req || $q.when(req);
			},
			config: _config
		};
	}
);
