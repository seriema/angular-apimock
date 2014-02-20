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
			request: function(config) {
				if (OFFLINE && config) {
					if (config.url.indexOf(_config.API_PATH) === 0) {
						var path = config.url.substring(_config.API_PATH.length);
						config.url = _config.OFFLINE_DATA_PATH + path + '.' + config.method.toLowerCase() + '.json';
					}
				}

				return config || $q.when(config);
			},
			config: _config
		};
	}
);
