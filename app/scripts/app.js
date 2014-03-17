
angular.module('apiMockApp', ['apiMock'])

	.run(function (httpInterceptor) {
		httpInterceptor.config({
			mockDataPath: '/mock_data',
			apiPath: '/api'
		});
	});