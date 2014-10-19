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
	var $log;
	var $rootScope;
	var defaultApiPath;
	var defaultMockPath;
	var defaultExpectPath;
	var defaultRequest;

  beforeEach(inject(function (_httpInterceptor_, _apiMock_, _$location_, _$http_, _$httpBackend_, _$log_, _$rootScope_) {
	  httpInterceptor = _httpInterceptor_;
    apiMock = _apiMock_;
    $location = _$location_;
		$http = _$http_;
		$httpBackend = _$httpBackend_;
		$log = _$log_;
		$rootScope = _$rootScope_;

		defaultApiPath = '/api/pokemon';
		defaultMockPath = '/mock_data/pokemon.get.json';
		defaultExpectPath = defaultMockPath;
		defaultRequest = {
			url: defaultApiPath,
			method: 'GET'
		};
	}));

	afterEach(function () {
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
			$httpBackend.expect(defaultRequest.method, defaultExpectPath).respond(404);

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
		}

		function expectHttpSuccess(done, fail) {
			$httpBackend.expect(defaultRequest.method, defaultExpectPath).respond({});

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
		}

		function assertFail() {
			expect(true).to.be.false; // Todo: How to fail the test if this happens?
		}


		describe('flag detection', function () {

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


		describe('command auto', function () {

			beforeEach(function () {
				// Set global flag to auto
				$location.search('apiMock', 'auto');
			});

			afterEach(function () {
				// Remove global flag
				$location.search('apiMock', null);
			});

			it('should automatically mock when request fails', function () {
				// Do a call, and expect it to recover from fail.
				$httpBackend.expect('GET', defaultApiPath).respond(404);

				expectHttpSuccess(function() {
					expect(apiMock._countFallbacks()).to.equal(0);
				});
			});

			it('cant automatically mock request on failure if the URL is an invalid API url', function () {
				// Don't include override, but use an URL that doesn't pass the isApiPath test.
				defaultExpectPath = '/something/people/pokemon';
				defaultRequest.url = defaultExpectPath;

				// Do a call, and expect it to fail.
				expectHttpFailure();
			});
		});


		describe('command HTTP status', function () {

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

					// Cannot use $http.expect() because HTTP status doesn't do a request
					$http(defaultRequest)
						.success(assertFail)
						.error(function(data, status) {
							expect(apiMock._countFallbacks()).to.equal(0);
							expect(status).to.equal(option);
						});

					$rootScope.$digest();
				});
			});

			it('should have basic header data in $http request status override', function () {
				// Cannot use $http.expect() because HTTP status doesn't do a request
				$http(defaultRequest)
					.success(assertFail)
					.error(function(data, status, headers) {
						expect(apiMock._countFallbacks()).to.equal(0);
						expect(headers).to.exist;
						expect(headers['Content-Type']).to.equal('text/html; charset=utf-8');
						expect(headers.Server).to.equal('Angular ApiMock');
					});

				$rootScope.$digest();
			});
		});


		describe('command mock', function () {

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


		describe('command off', function () {

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

		describe('$log.info', function () {

			it('should log when command is true', function () {
				$location.search('apiMock', true);

				expectHttpSuccess(function () {
					expect($log.info.logs[0][0]).to.equal('apiMock: rerouting ' + defaultApiPath + ' to ' + defaultMockPath);
				});
			});

			it('should log when command is auto', function () {
				$location.search('apiMock', 'auto');

				$httpBackend.expect(defaultRequest.method, defaultApiPath).respond(404);
				expectHttpSuccess(function () {
					expect($log.info.logs[0][0]).to.equal('apiMock: recovering from failure at ' + defaultApiPath);
				});
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
			});

		});

	});
});
