
angular.module('angularOfflineApp', ['offlineMode'])

	.run(function (httpInterceptor) {
		httpInterceptor.config({
			offlineDataPath: '/offline_data',
			apiPath: '/api'
		});
	});