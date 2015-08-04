'use strict';


describe('Service: apiMock', function () {

	// load the service's module
	beforeEach(module('apiMock'));

	// Hack (?) to get the provider so we can call .config()
	var apiMockProvider;
	beforeEach(module(function(_apiMockProvider_){
		apiMockProvider = _apiMockProvider_;
	}));

	// instantiate services
	var httpInterceptor;
	var apiMock;
	var $location;
	var $http;
	var $httpBackend;
	var $log;
	var $rootScope;
	var $timeout;

	var defaultApiPath;
	var defaultMockPath;
	var defaultExpectMethod;
	var defaultExpectPath;
	var defaultRequest;

	beforeEach(inject(function (_httpInterceptor_, _apiMock_, _$location_, _$http_, _$httpBackend_, _$log_, _$rootScope_, _$timeout_) {
		httpInterceptor = _httpInterceptor_;
		apiMock = _apiMock_;
		$location = _$location_;
		$http = _$http_;
		$httpBackend = _$httpBackend_;
		$log = _$log_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;

		defaultApiPath = '/api/pokemon';
		defaultMockPath = '/mock_data/pokemon.get.json';
		defaultExpectPath = defaultMockPath;
		defaultExpectMethod = 'GET';
		defaultRequest = {
			url: defaultApiPath,
			method: defaultExpectMethod
		};
	}));

	afterEach(function () {
		$timeout.verifyNoPendingTasks();

		$httpBackend.verifyNoOutstandingExpectation(); // loops and $httpBackend.expect() doesn't seem to play nice
		$httpBackend.verifyNoOutstandingRequest();
	});


/* This doesn't behave as when in the browser?
		it('should detect apimock param after hash', function () {
			$location.url('/#/view/?apimock=true');
			expect(apiMock.isMocking()).to.be.true;
		}); */

/* Need to test with html5Mode turned on, but how?
	it('should detect apimock param after hash', inject(function($locationProvider) {
		$locationProvider.html5Mode(true);
		$location.url('/#/view/?apimock=true');
		expect(apiMock.isMocking()).to.be.true;
	})); */


	// TODO: Add test for $http config overrides.
	describe('httpInterceptor', function () {

		function expectMockEnabled() {
		}

		function expectMockDisabled() {
			defaultExpectPath = defaultApiPath;
		}

		function expectHttpFailure(done, fail) {
			$httpBackend.expect(defaultExpectMethod, defaultExpectPath).respond(404);

			$http(defaultRequest)
				.success(function () {
					assertFail(); // Todo: How to fail the test if this happens?
					fail && fail();
				})
				.error(function (data, status) {
					done && done(data, status);
				});

			$rootScope.$digest();
			$httpBackend.flush();
			$timeout.flush();
		}

		function expectHttpSuccess(done, fail) {
			$httpBackend.expect(defaultExpectMethod, defaultExpectPath).respond({});

			$http(defaultRequest)
				.success(function () {
					done && done();
				})
				.error(function () {
					assertFail();
					fail && fail();
				});

			$rootScope.$digest();
			$httpBackend.flush();
			$timeout.flush();
		}

		function assertFail() {
			expect(true).to.be.false; // Todo: How to fail properly? There should be a method for that.
		}



		describe('URL flag', function () {

			describe('detection', function () {

				it('should detect parameter regardless of case on "apiMock". (http://server/?aPiMoCk=true)', function () {
					var value = true;

					// Define a valid query string.
					var keys = [
						'apimock',
						'apiMock',
						'APIMOCK',
						'ApImOcK',
						'ApiMock'
					];

					angular.forEach(keys, function(key) {
						// Set location with the query string.
						$location.search(key, value);

						// Test connection.
						expectMockEnabled();
						expectHttpSuccess();

						// Remove param tested from the location.
						$location.search(key, null);
					});
				});

				it('should detect in search queries', function () {
					$location.url('/page?apiMock=true');

					expectMockEnabled();
					expectHttpSuccess();
				});

				it('should be disabled and do regular call if no flag is present', function () {
					expectMockDisabled();
					expectHttpSuccess();
				});

				it('should accept only global flag set', function () {
					$location.search('apiMock', true);

					expectMockEnabled();
					expectHttpSuccess();
				});

				it('should accept only local flag set', function () {
					defaultRequest.apiMock = true;

					expectMockEnabled();
					expectHttpSuccess();
				});

				it('should accept local flag overriding global flag', function () {
					$location.search('apiMock', false);
					defaultRequest.apiMock = true;

					expectMockEnabled();
					expectHttpSuccess();
				});

				it('should work as usual if no flag is set', function () {
					expectMockDisabled();
					expectHttpFailure();
				});
			});

			describe('command', function () {

				describe('auto', function () {
					beforeEach(function () {
						// Set global flag to auto
						$location.search('apiMock', 'auto');
					});

					afterEach(function () {
						// Remove global flag
						$location.search('apiMock', null);
					});

					it('should automatically mock when request fails', function () {
						// First, it will try the API which will return a 404.
						$httpBackend.expect('GET', defaultApiPath).respond(404);
						$http(defaultRequest);
						$httpBackend.flush();

						// Now that it failed it will try the mock data instead.
						$httpBackend.expect(defaultExpectMethod, '/mock_data/pokemon.get.json').respond({});
						$timeout.flush();
						$httpBackend.flush();

						// The fallback list should be empty now.
						// TODO: It doesn't actually detect if no HTTP call was done.
						$timeout.flush();
						expect(apiMock._countFallbacks()).to.equal(0);
					});

					it('can\'t automatically mock request on failure if the URL is an invalid API url', function () {
						// Don't include override, but use an URL that doesn't pass the isApiPath test.
						defaultExpectPath = '/something/people/pokemon';
						defaultRequest.url = defaultExpectPath;

						// Do a call, and expect it to fail.
						expectHttpFailure();
					});
				});

				describe('HTTP status', function () {

					beforeEach(function () {
						// Set global flag to HTTP status
						$location.search('apiMock', 404);
					});

					it('should return status', function () {
						var options = [
							200,
							404,
							500
						];

						angular.forEach(options, function (option) {
							defaultRequest.apiMock = option;

							// Cannot use $httpBackend.expect() because HTTP status doesn't do a request
							$http(defaultRequest)
								.success(assertFail)
								.error(function(data, status) {
									expect(apiMock._countFallbacks()).to.equal(0);
									expect(status).to.equal(option);
								});

							$rootScope.$digest();
							$timeout.flush();
						});
					});

					it('should have basic header data in $http request status override', function () {
						// Cannot use $httpBackend.expect() because HTTP status doesn't do a request
						$http(defaultRequest)
							.success(assertFail)
							.error(function(data, status, headers) {
								expect(apiMock._countFallbacks()).to.equal(0);
								expect(headers).to.exist;
								expect(headers['Content-Type']).to.equal('text/html; charset=utf-8');
								expect(headers.Server).to.equal('Angular ApiMock');
							});

						$rootScope.$digest();
						$timeout.flush();
					});
				});

				describe('mock', function () {

					beforeEach(function () {
						// Set global flag to mock
						$location.search('apiMock', true);
					});

					it('should ignore query objects in request URL (path has /?)', function () {
						defaultRequest.url = '/api/pokemon/?name=Pikachu';

						expectHttpSuccess();
					});

					it('should ignore query objects in request URL (path has only ?)', function () {
						defaultRequest.url = '/api/pokemon?name=Pikachu';

						expectHttpSuccess();
					});

					it('should mock calls with valid API path', function () {
						expectHttpSuccess();
					});

					it('should not mock calls with invalid API path (no /api/ in path)', function () {
						defaultExpectPath = '/something/pikachu';
						defaultRequest.url = defaultExpectPath;

						expectHttpFailure();
					});

					it('should not mock calls with wrong API path (/api/ is not the beginning of path)', function () {
						defaultExpectPath = '/wrong/api/pikachu';
						defaultRequest.url = defaultExpectPath;

						expectHttpFailure();
					});

					it('should correctly reroute for all HTTP verbs', function () {
						var verbs = [
							'GET',
							'POST',
							'DELETE',
							'PUT'
						];

						angular.forEach(verbs, function (verb) {
							defaultExpectPath = '/mock_data/pokemon.'+verb.toLowerCase()+'.json';
							defaultRequest.method = verb;

							expectHttpSuccess();
						});
					});

				});

				describe('off', function () {

					it('should explicitly behave as usual with falsy values', function () {
						// Define falsy values.
						var values = [
							false,
							'',
							0,
							NaN,
							undefined,
							null
						];

						angular.forEach(values, function (value) {
							defaultRequest.apiMock = value;
							expectMockDisabled();

							expectHttpFailure();
						});

					});

				});
			});

		});

		describe('module config', function () {
			describe('disable option', function () {

				beforeEach(function() {
					apiMockProvider.config({disable: true});
				});

				afterEach(function() {
					apiMockProvider.config({disable: false});
				});

				it('should override command mock', function () {
					var key = 'apimock';
					$location.search(key, true);

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();

					// Remove param tested from the location.
					$location.search(key, null);
				});

				it('should override command auto', function () {
					var key = 'apimock';
					$location.search(key, 'auto');

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();

					// Remove param tested from the location.
					$location.search(key, null);
				});

			});

			describe('delay option', function () {
				var key = 'apiMock';
				var delayMs = 500;

				beforeEach(function() {
					apiMockProvider.config({delay: delayMs});
					$location.search(key, true);
				});

				afterEach(function() {
					apiMockProvider.config({delay: 0});
					$location.search(key, null);
				});

				it('should delay the request', function () {
					var didRun = false;

					// Test connection.
					$httpBackend.expect(defaultRequest.method, defaultExpectPath).respond({});
					$http(defaultRequest).finally(function () {
						didRun = true;
					});

					// Flush connection.
					$httpBackend.flush();

					// Don't flush $timeout completely.
					$timeout.flush(delayMs-1);
					expect($timeout.verifyNoPendingTasks).to.throw(Error);

					// Now flush it completely.
					$timeout.flush(1);
					expect($timeout.verifyNoPendingTasks).not.to.throw(Error);

					// Make sure it actually ran. (TODO: too many tests here)
					$rootScope.$digest();
					expect(didRun).to.be.true;
				});
			});
		});

		describe('logging', function () {

			it('should log when command is true', function () {
				$location.search('apiMock', true);

				expectHttpSuccess(function () {
					expect($log.info.logs[0][0]).to.equal('apiMock: rerouting ' + defaultApiPath + ' to ' + defaultMockPath);
				});
			});

			it('should log when command is auto', function () {
				$location.search('apiMock', 'auto');

				// First, it will try the API which will return a 404.
				$httpBackend.expect('GET', defaultApiPath).respond(404);
				$http(defaultRequest);
				$httpBackend.flush();

				// Now that it failed it will try the mock data instead.
				$httpBackend.expect(defaultExpectMethod, '/mock_data/pokemon.get.json').respond({});
				$timeout.flush();
				$httpBackend.flush();

				// Should have logged.
				$timeout.flush();
				expect($log.info.logs[0][0]).to.equal('apiMock: recovering from failure at ' + defaultApiPath);
			});

			it('should log when command is a HTTP status', function () {
				$location.search('apiMock', 404);

				// Don't do $httpBackend.expect() because the command doesn't do a real request.
				$http(defaultRequest)
					.error(function () {
						expect($log.info.logs[0][0]).to.equal('apiMock: mocking HTTP status to 404');
					})
					.success(assertFail);

				$rootScope.$digest();
				$timeout.flush();
			});

		});

	});
});
