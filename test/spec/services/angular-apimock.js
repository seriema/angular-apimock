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
	var defaultApiPath;
	var defaultMockPath;
	var defaultRequest;

  beforeEach(inject(function (_httpInterceptor_, _apiMock_, _$location_, _$http_, _$httpBackend_, _$log_) {
	  httpInterceptor = _httpInterceptor_;
    apiMock = _apiMock_;
    $location = _$location_;
		$http = _$http_;
		$httpBackend = _$httpBackend_;
		$log = _$log_;
		defaultApiPath = '/api/pokemon';
		defaultMockPath = '/mock_data/pokemon.get.json';
		defaultRequest = {
			url: defaultApiPath,
			method: 'GET'
		};
	}));

	afterEach(function () {
		//$httpBackend.verifyNoOutstandingExpectation(); // loops and $httpBackend.expect() doesn't seem to play nice
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


	describe('httpInterceptor', function () {

		function expectHttpFailure(done, expectedPath) {
			$httpBackend.expect(defaultRequest.method, expectedPath || defaultMockPath).respond(404);
			$http(defaultRequest)
				.success(function () {
					expect(true).to.be.false; // Todo: How to fail the test if this happens?
					done();
				})
				.error(function (data, status) {
					expect(status).to.equal(404);
					done();
				});
			$httpBackend.flush();
		}

		function expectHttpSuccess(done, expectedPath) {
			$httpBackend.expect(defaultRequest.method, expectedPath || defaultMockPath).respond({});
			$http(defaultRequest)
				.success(function () {
					done();
				})
				.error(function () {
					expect(true).to.be.false; // Todo: How to fail the test if this happens?
					done();
				});
			$httpBackend.flush();
		}

		describe('flag', function () {

			it('should detect parameter regardless of case on "apiMock". (http://server/?aPiMoCk=true)', function (done) {
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
					expectHttpSuccess(done);

					// Remove param tested from the location.
					$location.search(key, null);
				});
			});

			it('should detect in search queries', function (done) {
				$location.url('/page?apiMock=true');

				expectHttpSuccess(done);
			});

			it('should ignore query objects in request URL (path has /?)', function (done) {
				$location.search('apiMock', true);

				defaultRequest.url = '/api/pokemon/?name=Pikachu';

				expectHttpSuccess(done);
			});

			it('should ignore query objects in request URL (path has only ?)', function (done) {
				$location.search('apiMock', true);

				defaultRequest.url = '/api/pokemon?name=Pikachu';

				expectHttpSuccess(done);
			});

			it('should be disabled and do regular call if no flag is present', function (done) {
				expectHttpSuccess(done, defaultApiPath);
			});

			it('should accept only global flag set', function (done) {
				$location.search('apiMock', true);

				expectHttpSuccess(done);
			});

			it('should accept only local flag set', function (done) {
				defaultRequest.apiMock = true;

				expectHttpSuccess(done);
			});

			it('should accept local flag overriding global flag', function (done) {
				$location.search('apiMock', false);
				defaultRequest.apiMock = true;

				expectHttpSuccess(done);
			});

			it('should work as usual if no flag is set', function (done) {
				// Do a call, and expect it to fail.
				$httpBackend.when('GET', defaultApiPath).respond(404);

				$http(defaultRequest)
					.success(function() {
						expect(true).to.be.false; // Todo: How to fail the test if this happens?
						done();
					})
					.error(function() {
						expect(apiMock._countFallbacks()).to.equal(0);
						done();
					});

				$httpBackend.flush();
			});
		});


		describe('command auto', function () {

			it('should automatically mock when request fails', function (done) {
				// Set global flag: auto
				$location.search('apiMock', 'auto');

				// Don't include override
				var mockRequest = {
					url: '/api/people/pokemon',
					method: 'GET'
				};

				// Do a call, and expect it to recover from fail.
				$httpBackend.when('GET', '/api/people/pokemon').respond(404);
				$httpBackend.when('GET', '/mock_data/people/pokemon.get.json').respond(200);

				$http(mockRequest)
					.success(function() {
						expect(apiMock._countFallbacks()).to.equal(0);
						done();
					})
					.error(function() {
						expect(true).to.be.false; // Todo: How to fail the test if this happens?
						done();
					});

				$httpBackend.flush();
			});

			it('cant automatically mock request on failure if the URL is an invalid API url', function (done) {
				// Set global flag: auto
				$location.search('apiMock', 'auto');

				// Don't include override, but use an URL that doesn't pass the isApiPath test.
				var mockUrl = '/something/people/pokemon';
				var mockVerb = 'GET';
				var mockRequest = {
					url: mockUrl,
					method: mockVerb
				};

				// Do a call, and expect it to fail.
				$httpBackend.when(mockVerb, mockUrl).respond(404);
				$http(mockRequest)
					.success(function() {
						expect(true).to.be.false; // Todo: How to fail the test if this happens?
						done();
					})
					.error(function(data, status) {
						expect(apiMock._countFallbacks()).to.equal(0);
						expect(status).to.equal(404);
						done();
					});

				$httpBackend.flush();
			});
		});


		describe('command HTTP status', function () {

			it('should return status', function (done) {
				var options = [ 200, 404, 500 ];

				$location.search('apiMock', true);

				angular.forEach(options, function(option) {
					var mockRequest = {
						url: '/api/pokemon?name=Pikachu',
						method: 'GET',
						apiMock: option
					};

					$http(mockRequest)
						.success(function() {
							expect(true).to.be.false; // Todo: How to fail the test if this happens?
							done();
						})
						.error(function(data, status) {
							expect(apiMock._countFallbacks()).to.equal(0);
							expect(status).to.equal(option);
							done();
						});

					$httpBackend.flush();
				});

			});

			it('should have basic header data in $http request status override', function (done) {
				var mockRequest = {
					url: '/api/pokemon?name=Pikachu',
					method: 'GET',
					apiMock: 404
				};

				$http(mockRequest)
					.success(function() {
						expect(true).to.be.false; // Todo: How to fail the test if this happens?
						done();
					})
					.error(function(data, status, headers) {
						expect(apiMock._countFallbacks()).to.equal(0);
						expect(headers).to.exist;
						expect(headers['Content-Type']).to.equal('text/html; charset=utf-8');
						expect(headers.Server).to.equal('Angular ApiMock');
						done();
					});

				$httpBackend.flush();
			});
		});


		describe('command mock', function () {

			it('should mock calls with valid API path', function (done) {
				$location.search('apiMock', true);

				expectHttpSuccess(done);
			});

			it('should not mock calls with invalid API path', function (done) {
				$location.search('apiMock', true);

				var invalidApiPath = '/something/pikachu';
				defaultRequest.url = invalidApiPath;
				expectHttpFailure(done, invalidApiPath);
			});

			it('should not mock calls with wrong API path (/api/ is not the beginning of path)', function (done) {
				defaultRequest.url = 'wrong/' + defaultRequest.url;

				expectHttpFailure(done, defaultRequest.url);
			});

			it('should correctly reroute for all HTTP verbs', function (done) {
				$location.search('apiMock', true);

				var verbs = [
					'GET',
					'POST',
					'DELETE',
					'PUT'
				];

				verbs.forEach(function (verb) {
					var destination = '/mock_data/pokemon.'+verb.toLowerCase()+'.json';
					defaultRequest.method = verb;
					expectHttpSuccess(done, destination);
				});
			});

		});


		describe('command off', function () {

			it('should explicitly behave as usual with falsy values', function (done) {
				// Define falsy values.
				var values = [
					false,
					'',
					0,
					NaN,
					undefined,
					null
				];

				angular.forEach(values, function(value) {
					defaultRequest.apiMock = value;

					expectHttpFailure(done, defaultApiPath);
				});
			});

		});

		describe('$log.info', function () {

			it('should show when rerouting', function (done) {
				$location.search('apiMock', true);

				$httpBackend.expect(defaultRequest.method, defaultMockPath).respond({});
				$http(defaultRequest).success(function () {
					expect($log.info.logs[0][0]).to.equal('apiMock: rerouting ' + defaultApiPath + ' to ' + defaultMockPath);
					done();
				}).error(function() { console.log('banan'); expect(false).to.be.true; done(); });
				$httpBackend.flush();
			});

			it('should show when recovering', function (done) {
				$location.search('apiMock', 'auto');

//				$httpBackend.expect(defaultRequest.method, defaultMockPath).respond({});
				$httpBackend.expect(defaultRequest.method, defaultApiPath).respond(404);
				$http(defaultRequest).success(function () {
					expect($log.info.logs[0][0]).to.equal('apiMock: recovering from failure at ' + defaultApiPath);
					done();
				}).error(function() { console.log('banan'); expect(false).to.be.true; done(); });
				$httpBackend.flush();
			});

			it('should show when responding (mocking HTTP status)', function (done) {
				$location.search('apiMock', 404);

				$httpBackend.expect(defaultRequest.method, defaultApiPath).respond(404);
				$http(defaultRequest).error(function () {
					expect($log.info.logs[0][0]).to.equal('apiMock: mocking HTTP status to 404');
					done();
				}).success(function() { console.log('banan'); expect(false).to.be.true; done(); });
				$httpBackend.flush();
			});

		});

	});
});
