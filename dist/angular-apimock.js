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
      self = this;

      this.apiMocked = function() {
        var regex = /apimock/i,
          param = null;
        angular.forEach($location.search(), function(value, key) {
          if (regex.test(key)) {
            param = key;
            // Update $location object with primitive boolean compatibility in case if string type.
            if (value = angular.lowercase(value) === 'true') {
              $location.search(key, !!value);
            }

          }
        });
        return !!$location.search()[param] && typeof $location.search()[param] === 'boolean';
      };

      this.request = function (req) {
				if (self.apiMocked() && req) {
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
