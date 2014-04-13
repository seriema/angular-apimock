angular.module('apiMock', [])

	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})

	.factory('mockSwitch', function($location) {
		return {
			mockApi: function() {
				return !!$location.search().apimock;
			}
		};
	})

	.provider('httpInterceptor', function() {
    var config = {
      mockDataPath: '/mock_data',
      apiPath: '/api'
    };

    this.config = function (options) {
      angular.extend(config, options);
    };

		function HttpInterceptor($q, mockSwitch) {
			var doMock = mockSwitch.mockApi();

      this.apiMocked = mockSwitch.mockApi();
      this.request = function (req) {
				if (doMock && req) {
					if (req.url.indexOf(config.apiPath) === 0) {
						var path = req.url.substring(config.apiPath.length);
						req.url = config.mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
					}
				}

				return req || $q.when(req);
			};
		}

		this.$get = function ($q, mockSwitch) {
			return new HttpInterceptor($q, mockSwitch);
		};
	});
