'use strict';

angular.module('apiMockApp')
	.controller('MainCtrl', function ($scope, $http) {
		$scope.name = 'unknown';
		$scope.command = 'null';

		$http.get('/api/people/pikachu').success(function(data) {
			$scope.name = data.name;
			$scope.command = data.command;
		});
	});
