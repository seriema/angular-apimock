'use strict';


describe('Service: apiMock', function () {

	// load the service's module
	beforeEach(module('apiMock'));

	// Hack (?) to get the provider so we can call .config()
	var apiMockProvider;
	beforeEach(module(function (_apiMockProvider_) {
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

		function setGlobalCommand(command) {
			$location.search('apiMock', command);
		}

		function unsetGlobalCommand() {
			setGlobalCommand(null);
		}

		function expectMockEnabled() {
		}

		function expectMockDisabled() {
			defaultExpectPath = defaultApiPath;
		}

		function expectHttpFailure(doneCb, failCb) {
			$httpBackend.expect(defaultExpectMethod, defaultExpectPath).respond(404);

			$http(defaultRequest) // TODO: Callbacks isn't the proper way to test $http. It also doesn't seem to test properly as we can switch expectHttpSuccess() and expectHttpFailure() without tests failing.
				.success(function () {
					fail();
					failCb && failCb();
				})
				.error(function (data, status) {
					doneCb && doneCb(data, status);
				});

			$rootScope.$digest();
			$httpBackend.flush();
			$timeout.flush();
		}

		function expectHttpSuccess(doneCb, failCb) {
			$httpBackend.expect(defaultExpectMethod, defaultExpectPath).respond({});
			$http(defaultRequest) // TODO: Callbacks isn't the proper way to test $http. It also doesn't seem to test properly as we can switch expectHttpSuccess() and expectHttpFailure() without tests failing.
				.success(function () {
					doneCb && doneCb();
				})
				.error(function () {
					fail();
					failCb && failCb();
				});

			$rootScope.$digest();
			$httpBackend.flush();
			$timeout.flush();
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

					angular.forEach(keys, function (key) {
						// Set location with the query string.
						$location.search(key, value);

						// Test connection.
						expectMockEnabled();
						expectHttpSuccess();

						// Remove param tested from the location.
						$location.search(key, null);
					});
				});

				it('should detect HTTP verb command as string', function () {
					$location.url('/page?apiMock=200');

					// Cannot use $httpBackend.expect() because HTTP status doesn't do a request
					$http(defaultRequest)
						.success(fail)
						.error(function (data, status) {
							expect(apiMock._countFallbacks()).toEqual(0);
							expect(status).toEqual(200);
						});

					$rootScope.$digest();
					$timeout.flush();
				});

				it('should detect HTTP verb command as number', function () {
					$location.search('apimock', 200);

					// Cannot use $httpBackend.expect() because HTTP status doesn't do a request
					$http(defaultRequest)
						.success(fail)
						.error(function (data, status) {
							expect(apiMock._countFallbacks()).toEqual(0);
							expect(status).toEqual(200);
						});

					$rootScope.$digest();
					$timeout.flush();
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
						setGlobalCommand('auto');
					});

					afterEach(function () {
						unsetGlobalCommand();
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
						expect(apiMock._countFallbacks()).toEqual(0);
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
						setGlobalCommand(404);
					});

					afterEach(function () {
						unsetGlobalCommand();
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
								.success(fail)
								.error(function (data, status) {
									expect(apiMock._countFallbacks()).toEqual(0);
									expect(status).toEqual(option);
								});

							$rootScope.$digest();
							$timeout.flush();
						});
					});

					it('should have basic header data in $http request status override', function () {
						// Cannot use $httpBackend.expect() because HTTP status doesn't do a request
						$http(defaultRequest)
							.success(fail)
							.error(function (data, status, headers) {
								expect(apiMock._countFallbacks()).toEqual(0);
								expect(headers).toExist;
								expect(headers['Content-Type']).toEqual('text/html; charset=utf-8');
								expect(headers.Server).toEqual('Angular ApiMock');
							});

						$rootScope.$digest();
						$timeout.flush();
					});
				});

				describe('mock', function () {

					beforeEach(function () {
						setGlobalCommand(true);
					});

					afterEach(function () {
						unsetGlobalCommand();
					});

					it('should ignore query objects in request URL (path has /?)', function () {
						defaultRequest.url = '/api/pokemon/?name=Pikachu';

						expectHttpSuccess();
					});

					it('should ignore query objects in request URL (path has only ?)', function () {
						defaultRequest.url = '/api/pokemon?name=Pikachu';

						expectHttpSuccess();
					});

					it('should ignore query objects in config.params', function () {
						defaultRequest.params = { 'name': 'Pikachu' };

						expectHttpSuccess();
					});

					it('should ignore config.data', function () {
						defaultRequest.data = { 'name': 'Pikachu' };

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
							defaultExpectPath = '/mock_data/pokemon.' + verb.toLowerCase() + '.json';
							defaultRequest.method = verb;

							expectHttpSuccess();
						});
					});

				});

				describe('off', function () {

					it('should not mock with falsy values', function () {
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

				beforeEach(function () {
					apiMockProvider.config({disable: true});
				});

				afterEach(function () {
					apiMockProvider.config({disable: false});
				});

				it('should override config default mock', function () {
					apiMockProvider.config({defaultMock: true});

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();

					unsetGlobalCommand();
				});

				it('should override command mock', function () {
					setGlobalCommand(true);

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();

					unsetGlobalCommand();
				});

				it('should override command auto', function () {
					setGlobalCommand('auto');

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();

					unsetGlobalCommand();
				});

			});

			describe('default mock option', function () {
				beforeEach(function () {
					//apiMockProvider.config({defaultMock: true});
				});

				afterEach(function () {
					apiMockProvider.config({defaultMock: false});
					unsetGlobalCommand();
				});

				it('should mock even without global or local flag', function () {
					apiMockProvider.config({defaultMock: true});

					// Test connection.
					expectMockEnabled();
					expectHttpSuccess();
				});

				it('should be overriden by global flag', function () {
					apiMockProvider.config({defaultMock: true});
					setGlobalCommand(false);

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();
				});

				it('should be overriden by local flag', function () {
					apiMockProvider.config({defaultMock: true});
					defaultRequest.apiMock = false;

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();
				});

				it('should not mock when set to false', function () {
					apiMockProvider.config({defaultMock: false});

					// Test connection.
					expectMockDisabled();
					expectHttpFailure();
				});
			});

			describe('allow regexp for apiPath option instead of string', function () {

				beforeEach(function () {
					// apiMockProvider.config({apiPath: [/\/(aPI)/i]});
					apiMockProvider.config({apiPath: /\/(aPi|UPI|APU)/i});
					setGlobalCommand(true);
				});

				afterEach(function () {
					apiMockProvider.config({apiPath: '/api'});
					unsetGlobalCommand();
				});

				it('should redirect when match', function () {
					defaultRequest.url = '/api/pokemon';
					defaultExpectPath = '/mock_data/pokemon.get.json';
					expectHttpSuccess();
				});

				it('should redirect any match', function () {
					defaultRequest.url = '/UPI/pokemon';
					defaultExpectPath = '/mock_data/pokemon.get.json';
					expectHttpSuccess();
				});

				it('should NOT redirect not matched', function () {
					defaultRequest.url = '/EPI/picachu';
					defaultExpectPath = '/EPI/picachu';
					expectHttpFailure();
				});

			});

			describe('allow strings array for apiPath option', function () {

				beforeEach(function () {
					apiMockProvider.config({apiPath: [ '/other/api', '/api', '/v2api' ]});
					setGlobalCommand(true);
				});

				afterEach(function () {
					apiMockProvider.config({apiPath: '/api'});
					unsetGlobalCommand();
				});

				it('should redirect when match first in list', function () {
					defaultRequest.url = '/other/api/otherpikamon';
					defaultExpectPath = '/mock_data/otherpikamon.get.json';
					expectHttpSuccess();
				});

				it('should redirect when match second in list', function () {
					defaultRequest.url = '/api/pikamon';
					defaultExpectPath = '/mock_data/pikamon.get.json';
					expectHttpSuccess();
				});

				it('should redirect when match third in list as regexp', function () {
					defaultRequest.url = '/v2api/v2pikamon';
					defaultExpectPath = '/mock_data/v2pikamon.get.json';
					expectHttpSuccess();
				});

				it('should NOT redirect not matched', function () {
					defaultRequest.url = '/v9api/v9picachu';
					defaultExpectPath = '/v9api/v9picachu';
					expectHttpFailure();
				});

			});

			describe('allow regexp array for apiPath option', function () {

				beforeEach(function () {
					apiMockProvider.config({apiPath: [ /\/other\/api/i, /\/api/i, /\/v(2|3|4)api/i ]});
					setGlobalCommand(true);
				});

				afterEach(function () {
					apiMockProvider.config({apiPath: '/api'});
					unsetGlobalCommand();
				});

				it('should redirect when match first in list', function () {
					defaultRequest.url = '/other/api/otherpikamon';
					defaultExpectPath = '/mock_data/otherpikamon.get.json';
					expectHttpSuccess();
				});

				it('should redirect when match second in list', function () {
					defaultRequest.url = '/api/pikamon';
					defaultExpectPath = '/mock_data/pikamon.get.json';
					expectHttpSuccess();
				});


				it('should redirect when match third in list as regexp', function () {
					defaultRequest.url = '/v2api/v2pikamon';
					defaultExpectPath = '/mock_data/v2pikamon.get.json';
					expectHttpSuccess();
				});

				it('should redirect when match third again in list as regexp', function () {
					defaultRequest.url = '/v3api/v3pikamon';
					defaultExpectPath = '/mock_data/v3pikamon.get.json';
					expectHttpSuccess();
				});

				it('should NOT redirect not matched', function () {
					defaultRequest.url = '/v9api/v9picachu';
					defaultExpectPath = '/v9api/v9picachu';
					expectHttpFailure();
				});

      });

			describe('enable query params', function () {

				beforeEach(function () {
					apiMockProvider.config({stripQueries: false});
					setGlobalCommand(true);
				});

				afterEach(function () {
					apiMockProvider.config({stripQueries: true});
					unsetGlobalCommand();
				});

				it('should still redirect simple paths without query params', function () {
					expectHttpSuccess();
				});

				it('should still ignore config.data', function () {
					defaultRequest.data = {
						'moves': [ 'Thunder Shock', 'Volt Tackle' ]
					};

					expectHttpSuccess();
				});

				it('should NOT ignore query objects in request URL (path has /?)', function () {
					defaultRequest.url = '/api/pokemon/?name=pikachu';
					defaultExpectPath = '/mock_data/pokemon/name=pikachu.get.json';
					expectHttpSuccess();
				});

				it('should NOT ignore query objects in request URL (path has only ?)', function () {
					defaultRequest.url = '/api/pokemon?name=pikachu';
					defaultExpectPath = '/mock_data/pokemon/name=pikachu.get.json';
					expectHttpSuccess();
				});

				it('should NOT ignore query objects in config.params', function () {
					defaultRequest.url = '/api/pokemon';
					defaultRequest.params = { 'name': 'pikachu', 'strength': 'electricity' };
					defaultExpectPath = '/mock_data/pokemon/name=pikachu&strength=electricity.get.json';
					expectHttpSuccess();
				});

				it('should sort query objects in request URL', function () {
					defaultRequest.url = '/api/pokemon?strength=electricity&name=pikachu';
					defaultExpectPath = '/mock_data/pokemon/name=pikachu&strength=electricity.get.json';
					expectHttpSuccess();
				});

				it('should sort query objects in alphabetical order', function () {
					defaultRequest.url = '/api/pokemon';
					defaultRequest.params = { 'strength': 'electricity', 'name': 'pikachu' };
					defaultExpectPath = '/mock_data/pokemon/name=pikachu&strength=electricity.get.json';
					expectHttpSuccess();
				});

				it('should handle a mix of query objects and query params in url', function () {
					defaultRequest.url = '/api/pokemon?strength=electricity&hp=150';
					defaultRequest.params = { 'name': 'pikachu' };
					defaultExpectPath = '/mock_data/pokemon/hp=150&name=pikachu&strength=electricity.get.json';
					expectHttpSuccess();
				});

				it('should encode characters in query params', function () {
					defaultRequest.url = '/api/pokemon?lang=sl&name=pikaču';
					defaultExpectPath = '/mock_data/pokemon/lang=sl&name=pika%c4%8du.get.json';
					expectHttpSuccess();
				});

				it('should lowercase characters in query params', function () {
					defaultRequest.url = '/api/pokemon?NAME=PIKACHU';
					defaultExpectPath = '/mock_data/pokemon/name=pikachu.get.json';
					expectHttpSuccess();
				});

				it('should serialize nested objects', function () {
					defaultRequest.url = '/api/pokemon';
					defaultRequest.params = {
						'movesAppearences': {
							'Thunder Shock': 'Pokémon - I Choose You!',
							'Volt Tackle': 'May\'s Egg-Cellent Adventure!'
						}
					};
					defaultExpectPath = '/mock_data/pokemon/movesappearences%5bthunder+shock%5d=pok%c3%a9mon+-+i+choose+you!&movesappearences%5bvolt+tackle%5d=may\'s+egg-cellent+adventure!.get.json';

					expectHttpSuccess();
				});

				it('should serialize nested arrays', function () {
					defaultRequest.url = '/api/pokemon';
					defaultRequest.params = {
						'moves': [ 'Thunder Shock', 'Volt Tackle' ]
					};
					defaultExpectPath = '/mock_data/pokemon/moves%5b%5d=thunder+shock&moves%5b%5d=volt+tackle.get.json';

					expectHttpSuccess();
				});

				it('should serialize objects nested inside arrays', function () {
					defaultRequest.url = '/api/pokemon';
					defaultRequest.params = {
						'moves': [ {
							'Thunderbolt': {
								power: 95,
								type: 'Electric'
							}}, {
							'Double Edge': {
								power: 120,
								type: 'Normal'
							}
						} ]
					};
					defaultExpectPath = '/mock_data/pokemon/moves%5b0%5d%5bthunderbolt%5d%5bpower%5d=95&moves%5b0%5d%5bthunderbolt%5d%5btype%5d=electric&moves%5b1%5d%5bdouble+edge%5d%5bpower%5d=120&moves%5b1%5d%5bdouble+edge%5d%5btype%5d=normal.get.json';

					expectHttpSuccess();
				});

				it('should handle empty value', function () {
					defaultRequest.url = '/api/pokemon?releaseDate';
					defaultExpectPath = '/mock_data/pokemon/releasedate.get.json';

					expectHttpSuccess();
				});

				it('should handle undefined value', function () {
					defaultRequest.url = '/api/pokemon';
					defaultRequest.params = {
						'releaseDate': undefined
					};
					defaultExpectPath = '/mock_data/pokemon/releasedate.get.json';

					expectHttpSuccess();
				});

				it('should serialize date type', function () {
					defaultRequest.url = '/api/pokemon';
					defaultRequest.params = {
						'releaseDate': new Date(Date.UTC(96, 1, 27, 0, 0, 0))
					};
					defaultExpectPath = '/mock_data/pokemon/releasedate=1996-02-27t00:00:00.000z.get.json';

					expectHttpSuccess();
				});
			});

			describe('delay option', function () {
				var delayMs = 500;

				beforeEach(function () {
					apiMockProvider.config({delay: delayMs});
					setGlobalCommand(true);
				});

				afterEach(function () {
					apiMockProvider.config({delay: 0});
					unsetGlobalCommand();
				});

				it('should delay the request', function () {
					var didRun = false;

					// Test connection.
					$httpBackend.expect(defaultRequest.method, defaultExpectPath).respond({});
					$http(defaultRequest).success(function () {
						didRun = true;
					});

					// Flush connection.
					$httpBackend.flush();

					// Don't flush $timeout completely.
					$timeout.flush(delayMs - 1);
					expect($timeout.verifyNoPendingTasks).toThrow();
					$rootScope.$digest();
					expect(didRun).toBe(false);

					// Now flush it completely.
					$timeout.flush(1);
					expect($timeout.verifyNoPendingTasks).not.toThrow();

					// Make sure it actually ran. (TODO: too many tests here)
					$rootScope.$digest();
					expect(didRun).toBe(true);
				});
			});
		});

		describe('logging', function () {

			it('should log when command is true', function () {
				setGlobalCommand(true);

				expectHttpSuccess(function () {
					expect($log.info.logs[0][0]).toEqual('apiMock: rerouting ' + defaultApiPath + ' to ' + defaultMockPath);
				});

				unsetGlobalCommand();
			});

			it('should log when command is auto', function () {
				setGlobalCommand('auto');

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
				expect($log.info.logs[0][0]).toEqual('apiMock: recovering from failure at ' + defaultApiPath);

				unsetGlobalCommand();
			});

			it('should log when command is a HTTP status', function () {
				setGlobalCommand(404);

				// Don't do $httpBackend.expect() because the command doesn't do a real request.
				$http(defaultRequest)
					.error(function () {
						expect($log.info.logs[0][0]).toEqual('apiMock: mocking HTTP status to 404');
					})
					.success(fail);

				$rootScope.$digest();
				$timeout.flush();

				unsetGlobalCommand();
			});

		});

	});
});
