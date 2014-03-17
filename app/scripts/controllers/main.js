'use strict';

angular.module('apiMockApp')
	.controller('MainCtrl', function ($scope, $http, mockSwitch) {
		$scope.name = '';
		$scope.apiMocked = mockSwitch.mockApi();

		$http.get('/api/people/pikachu').success(function(data) {
			$scope.name = data.name;
		}).error(function(data) {
			$scope.name = data;
		});
	});
