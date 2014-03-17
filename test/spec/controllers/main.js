'use strict';

describe('Controller: MainCtrl', function () {

	// load the controller's module
	beforeEach(module('apiMockApp'));

	var MainCtrl,
		scope,
		httpBackend;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
		scope = $rootScope.$new();
		MainCtrl = $controller('MainCtrl', {
			$scope: scope
		});
		httpBackend = $httpBackend;
		httpBackend.when('GET', '/api/people/pikachu').respond({name: 'foo', command: 'bar'});
		httpBackend.when('GET', '/mock_data/people/pikachu.get.json').respond({name: 'Pikachu'});
	}));

	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

	it('should hit /api when online', function () {
		httpBackend.expect('GET', '/api/people/pikachu');
		httpBackend.flush();
		expect(scope.name).toBe('foo');
		expect(scope.command).toBe('bar');
	});

	it('should hit /mock_data when offline', function () {
		window.location.search = 'apimock=true';
		httpBackend.expect('GET', '/mock_data/people/pikachu.get.json');
		httpBackend.flush();
		expect(scope.name).toBe('Pikachu');
	});
});
