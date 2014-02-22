'use strict';

describe('Controller: MainCtrl', function () {

	// load the controller's module
	beforeEach(module('angularOfflineApp'));

	var MainCtrl,
		scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		MainCtrl = $controller('MainCtrl', {
			$scope: scope
		});
	}));

	it('should have "unknwon" as name when starting', function () {
		expect(scope.name).toBe('unknown');
	});

	it('should have "null" as command when starting', function () {
		expect(scope.command).toBe('null');
	});
});
