'use strict';

describe('Service: apiMock', function () {

  // load the service's module
  beforeEach(module('apiMock'));

  // instantiate services
  var httpInterceptor;
  var apiMock;
  var $location;

  beforeEach(inject(function (_httpInterceptor_, _apiMock_, _$location_) {
	  httpInterceptor = _httpInterceptor_;
    apiMock = _apiMock_;
    $location = _$location_;
  }));


	describe('_isLocalMock', function () {

		it('should detect mock in $http requests so specific calls can override', function () {
			var request = { apiMock: true };

			var result = apiMock._isLocalMock(request);
			expect(result).toBe(true);
		});

		it('should not mock if $http request disables it', function () {
			var options = [false, ''];

			angular.forEach(options, function (option) {
				var request = { apiMock: option };
				var result = apiMock._isLocalMock(request);

				expect(result).toBe(false);
			});
		});

		it('should return undefined if $http request doesnt contain override', function () {
			var request = { apiMock: undefined };
			var result = apiMock._isLocalMock(request);

			expect(result).toBe(undefined);
		});
	});


	describe('_isGlobalMock', function () {

		it('should detect apimock param in search queries', function () {
			$location.url('/page?apimock=true');
			expect(apiMock._isGlobalMock()).toBe(true);
		});

		it('should return true when apimock param is equal to true. (http://server/?apimock=true)', function () {
			var options;
			var key;
			var value;

			// Define a valid query string.
			options = [
				{'apimock': true},
				{'apiMock': true},
				{'APIMOCK': true},
				{'ApiMock': true},
				{'apimock': 'true'},
				{'apimock': 'True'},
				{'apimock': 'TRUE'}
			];

			angular.forEach(options, function(option) {
				key = Object.getOwnPropertyNames(option).pop();
				value = option[key];

				// Set location with the query string.
				$location.search(key, value);
				expect(apiMock._isGlobalMock()).toBe(true);

				// Remove param tested from the location.
				$location.search(key, null);
			});

		});

		it('should return false when apimock param is equal to false, or an object different of typeof boolean.', function () {
			var options;
			var key;
			var value;

			// Define a NOT valid query string.
			options = [
				{'apimock': false},
				{'apimock': 'false'},
				{'apimock': 'False'},
				{'apimock': 'FALSE'},
				{'apimock': 1},
				{'apimock': 'not valid'},
				{'apimock': 40}
			];

			angular.forEach(options, function(option) {
				key = Object.getOwnPropertyNames(option).pop();
				value = option[key];

				// Set location with the query string.
				$location.search(key, value);
				expect(apiMock._isGlobalMock()).toBe(false);

				// Remove param tested from the location.
				$location.search(key, null);
			});
		});

		it('should return false when apimock param is not present in the query string. (http://server/)', function () {
			expect(apiMock._isGlobalMock()).toBe(false);
		});
	});


	describe('_isApiPath', function () {

		it('should detect /api path', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'GET'
			};

			var result = apiMock._isApiPath(mockRequest);
			expect(result).toBe(true);
		});

		it('should not detect /api path when its not present', function () {
			var mockRequest = {
				url: '/games/pokemon/1',
				method: 'GET'
			};

			var result = apiMock._isApiPath(mockRequest);
			expect(result).toBe(false);
		});

		it('should not detect /api path when its not the first folder', function () {
			var mockRequest = {
				url: '/games/api/pokemon/1',
				method: 'GET'
			};

			var result = apiMock._isApiPath(mockRequest);
			expect(result).toBe(false);
		});
	});


	describe('shouldMock', function () {

		it('should override search queries if $http apimock is set to false', function () {
			$location.url('/page?apimock=true');
			var request = { url: '/api/pokemon/1', apiMock: false };
			var result = apiMock.shouldMock(request);

			expect(result).toBe(false);
		});

		it('should override search queries if $http apimock is set to true', function () {
			$location.url('/page?apimock=false');
			var request = { url: '/api/pokemon/1', apiMock: true };
			var result = apiMock.shouldMock(request);

			expect(result).toBe(true);
		});
	});


	/* This doesn't behave as when in the browser?
		it('should detect apimock param after hash', function () {
			$location.url('/#/view/?apimock=true');
			expect(apiMock.isMocking()).toBe(true);
		}); */

/* Need to test with html5Mode turned on, but how?
  it('should detect apimock param after hash', inject(function($locationProvider) {
    $locationProvider.html5Mode(true);
    $location.url('/#/view/?apimock=true');
    expect(apiMock.isMocking()).toBe(true);
  })); */


	describe('doMock', function () {

		it('should correctly change path for GET requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'GET'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).toBe('/mock_data/pokemon/1.get.json');
		});

		it('should correctly change path for POST requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'POST'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).toBe('/mock_data/pokemon/1.post.json');
		});

		it('should correctly change path for DELETE requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'DELETE'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).toBe('/mock_data/pokemon/1.delete.json');
		});

		it('should correctly change path for PUT requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'PUT'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).toBe('/mock_data/pokemon/1.put.json');
		});

		it('should ignore query objects in URL, with /?', function () {
			var mockRequest = {
				url: '/api/pokemon/?name=Pikachu',
				method: 'GET'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).toBe('/mock_data/pokemon.get.json');
		});

		it('should ignore query objects in URL, with just ?', function () {
			var mockRequest = {
				url: '/api/pokemon?name=Pikachu',
				method: 'GET'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).toBe('/mock_data/pokemon.get.json');
		});
	});

});
