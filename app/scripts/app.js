
angular.module('apiMockApp', ['apiMock'])

	.run(function (httpInterceptor) {
		httpInterceptor.config({
			offlineDataPath: '/mock_data',
			apiPath: '/api'
		});
	});