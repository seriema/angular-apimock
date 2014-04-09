
angular.module('apiMockApp', ['apiMock'])

	.config(function (httpInterceptorProvider) {
		httpInterceptorProvider.config({
      mockDataPath: '/mock_data',
      apiPath: '/api'
    });
	});
