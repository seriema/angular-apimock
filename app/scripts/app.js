
angular.module('angularOfflineApp', ['offlineMode'])

	.run(function (httpInterceptor) {
		httpInterceptor.config.OFFLINE_DATA_PATH = '/offline_data';
		httpInterceptor.config.API_PATH = '/api';
	}
);