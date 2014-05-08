'use strict';

describe('Service: apiMock', function () {

  // load the service's module
  beforeEach(module('apiMock'));

  // instantiate services
  var httpInterceptor;
  var apiMock;
  var $location;
	var $http;
	var $httpBackend;

  beforeEach(inject(function (_httpInterceptor_, _apiMock_, _$location_, _$http_, _$httpBackend_) {
	  httpInterceptor = _httpInterceptor_;
    apiMock = _apiMock_;
    $location = _$location_;
		$http = _$http_;
		$httpBackend = _$httpBackend_;
  }));


	describe('_isLocalMock', function () {

		it('should detect mock in $http requests so specific calls can override', function () {
			var request = { apiMock: true };

			var result = apiMock._isLocalMock(request);
			expect(result).to.equal(true);
		});

		it('should not mock if $http request disables it', function () {
			var options = [false, ''];

			angular.forEach(options, function (option) {
				var request = { apiMock: option };
				var result = apiMock._isLocalMock(request);

				expect(result).to.equal(false);
			});
		});

		it('should return undefined if $http request doesnt contain override', function () {
			var request = { apiMock: undefined };
			var result = apiMock._isLocalMock(request);

			expect(result).to.equal(undefined);
		});

		it('should respond with status code if $http request contains status code override', function () {
			var request = { apiMock: 404 };
			var result = apiMock._isLocalMock(request);

			expect(result).to.equal(404);
		});
	});


	describe('_isGlobalMock', function () {

		it('should detect apimock param in search queries', function () {
			$location.url('/page?apimock=true');
			expect(apiMock._isGlobalMock()).to.equal(true);
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
				expect(apiMock._isGlobalMock()).to.equal(true);

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
				expect(apiMock._isGlobalMock()).to.equal(false);

				// Remove param tested from the location.
				$location.search(key, null);
			});
		});

		it('should return false when apimock param is not present in the query string. (http://server/)', function () {
			expect(apiMock._isGlobalMock()).to.equal(false);
		});
	});


	describe('_isApiPath', function () {

		it('should detect /api path', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'GET'
			};

			var result = apiMock._isApiPath(mockRequest);
			expect(result).to.equal(true);
		});

		it('should not detect /api path when its not present', function () {
			var mockRequest = {
				url: '/games/pokemon/1',
				method: 'GET'
			};

			var result = apiMock._isApiPath(mockRequest);
			expect(result).to.equal(false);
		});

		it('should not detect /api path when its not the first folder', function () {
			var mockRequest = {
				url: '/games/api/pokemon/1',
				method: 'GET'
			};

			var result = apiMock._isApiPath(mockRequest);
			expect(result).to.equal(false);
		});
	});


	describe('shouldMock', function () {

		it('should override search queries if $http apimock is set to false', function () {
			$location.url('/page?apimock=true');
			var request = { url: '/api/pokemon/1', apiMock: false };
			var result = apiMock.shouldMock(request);

			expect(result).to.equal(false);
		});

		it('should override search queries if $http apimock is set to true', function () {
			$location.url('/page?apimock=false');
			var request = { url: '/api/pokemon/1', apiMock: true };
			var result = apiMock.shouldMock(request);

			expect(result).to.equal(true);
		});
	});


	/* This doesn't behave as when in the browser?
		it('should detect apimock param after hash', function () {
			$location.url('/#/view/?apimock=true');
			expect(apiMock.isMocking()).to.equal(true);
		}); */

/* Need to test with html5Mode turned on, but how?
  it('should detect apimock param after hash', inject(function($locationProvider) {
    $locationProvider.html5Mode(true);
    $location.url('/#/view/?apimock=true');
    expect(apiMock.isMocking()).to.equal(true);
  })); */


	describe('doMock', function () {

		it('should correctly change path for GET requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'GET'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).to.equal('/mock_data/pokemon/1.get.json');
		});

		it('should correctly change path for POST requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'POST'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).to.equal('/mock_data/pokemon/1.post.json');
		});

		it('should correctly change path for DELETE requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'DELETE'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).to.equal('/mock_data/pokemon/1.delete.json');
		});

		it('should correctly change path for PUT requests', function () {
			var mockRequest = {
				url: '/api/pokemon/1',
				method: 'PUT'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).to.equal('/mock_data/pokemon/1.put.json');
		});

		it('should ignore query objects in URL, with /?', function () {
			var mockRequest = {
				url: '/api/pokemon/?name=Pikachu',
				method: 'GET'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).to.equal('/mock_data/pokemon.get.json');
		});

		it('should ignore query objects in URL, with just ?', function () {
			var mockRequest = {
				url: '/api/pokemon?name=Pikachu',
				method: 'GET'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).to.equal('/mock_data/pokemon.get.json');
		});

		it('should ignore query objects in URL, with just ?', function () {
			var mockRequest = {
				url: '/api/pokemon?name=Pikachu',
				method: 'GET'
			};

			apiMock.doMock(mockRequest);
			expect(mockRequest.url).to.equal('/mock_data/pokemon.get.json');
		});

		it('should return status if overriding request', function (done) {
			var options = [ 200, 404, 500 ];

			angular.forEach(options, function(option) {
				var mockRequest = {
					url: '/api/pokemon?name=Pikachu',
					method: 'GET',
					apiMock: option
				};

				$http(mockRequest)
					.success(function() {
						// this callback will be called asynchronously
						// when the response is available
						expect(true).to.equal(false);
						done();
					})
					.error(function(data, status) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						expect(status).to.equal(option);
						done();
					});

				$httpBackend.flush();
			});

		});

		it('should have basic header data in $http request override', function (done) {
			var mockRequest = {
				url: '/api/pokemon?name=Pikachu',
				method: 'GET',
				apiMock: 404
			};

			$http(mockRequest)
				.success(function() {
					// this callback will be called asynchronously
					// when the response is available
					expect(true).to.equal(false);
					done();
				})
				.error(function(data, status, headers) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					expect(headers['Content-Type']).to.equal('text/html; charset=utf-8');
					expect(headers.Server).to.equal('Angular ApiMock');
					done();
				});

			$httpBackend.flush();
		});
	});

});
