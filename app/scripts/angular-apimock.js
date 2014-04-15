angular.module('apiMock', [])

	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpInterceptor');
	})

	.provider('httpInterceptor', function() {
    var config = {
      mockDataPath: '/mock_data',
      apiPath: '/api'
    };

    this.config = function (options) {
      angular.extend(config, options);
    };

    function HttpInterceptor($q, $location) {
      this.apiMocked = function() {
        var regex = /apimock/i,
          param = null;
        angular.forEach($location.search(), function(value, key) {
          if (regex.test(key)) {
            param = key;
          }
        });
        return !!$location.search()[param] && typeof $location.search()[param] === 'boolean';
      };

      this.request = function (req) {
				if (this.apiMocked() && req) {
					if (req.url.indexOf(config.apiPath) === 0) {
						var path = req.url.substring(config.apiPath.length);
						req.url = config.mockDataPath + path + '.' + req.method.toLowerCase() + '.json';
					}
				}

				return req || $q.when(req);
			};
		}

		this.$get = function ($q, $location) {
			return new HttpInterceptor($q, $location);
		};
	});
