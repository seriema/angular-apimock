'use strict';

angular.module('offlineMode', [])
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})
	.factory('httpInterceptor', function ($q) {
		function getUrlParameterByName(name) {
			name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
			var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
				results = regex.exec(location.search);
			return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
		}

		var OFFLINE = getUrlParameterByName('offline') === 'true';
		var _config = {
			OFFLINE_DATA_PATH: 'lol',
			API_PATH: 'rooofl'
		};

		return {
			request: function(config) {
				var parts = config.url.indexOf('/') === 0 ? config.url.substr(1, config.url.length).split('/') : config.url.split('/');

				if (OFFLINE && parts.splice(0, 1)[0] === _config.API_PATH) {
					config.url = _config.OFFLINE_DATA_PATH + parts.join('/') + '.json';
				}
				return config || $q.when(config);
			},
			config: _config
		};
	}
);
