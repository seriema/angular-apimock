'use strict';

angular.module('offlineHttpInterceptor', [])
  .config(function ($httpProvider) {

	$httpProvider.interceptors.push(function() {
		return {
			'request': function(config) {
				if (config.url.indexOf('/api') > -1) {
					config.url = '/offline_data/people/pikachu.json';
				}
				return config;
				// same as above
			}
		};
	});
  });
