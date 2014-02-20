'use strict';

angular.module('offlineMode', [])
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})
	.factory('httpInterceptor', function ($q) {

		var OFFLINE = location.search.indexOf('offline=true') > -1;

		var _config = {
			OFFLINE_DATA_PATH: 'lol',
			API_PATH: 'rooofl'
		};

		return {
			request: function(config) {
				if (OFFLINE && config) {
					var parts = config.url.indexOf('/') === 0 ? config.url.substr(1, config.url.length).split('/') : config.url.split('/');

					if (parts.splice(0, 1)[0] === _config.API_PATH) {
						config.url = _config.OFFLINE_DATA_PATH + parts.join('/') + '.json';
					}
				}

				return config || $q.when(config);
			},
			config: _config
		};
	}
);
