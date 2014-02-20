function getUrlParameterByName(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
		results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var OFFLINE = getUrlParameterByName('offline') === 'true';
var JS_ANGULAR_FOLDER = '/bower_components/angular-mocks/';
var JSON_SERVER_URL = '/offline_data/';

function demand(file) {
	var result;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			result = xhr.responseText;
		}
	};
	xhr.open('GET', file, false);
	xhr.send(null);

	return result;
}

angular.module('angularOfflineApp', ['offlineHttpInterceptor'])
/*
	.config(['$provide', function ($provide) {
		if (OFFLINE) {
			var se = document.createElement('script');
			se.type = 'text/javascript';
			se.text = demand(JS_ANGULAR_FOLDER+'angular-mocks.js');
			document.getElementsByTagName('head')[0].appendChild(se);

			$provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
		}
	}])
*/
/*
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push(function() {
			return {
				'request': function(config) {
					// same as above
				},

				'response': function(response) {
					// same as above
				}
			};
		});
	}])
*/
	.run(['$injector', function ($injector) {
		if (OFFLINE) {
//			var $httpBackend = $injector.get('$httpBackend');
//			var $httpProvider = $injector.get('$httpProvider');


//			$httpBackend.when('GET', '/api/people/pikachu').respond(demand(JSON_SERVER_URL+'people/pikachu.json'));
//			$httpBackend.when('GET', new RegExp('/api/ProductSearch(\.*)')).respond(demand(JSON_SERVER_URL+'get.productsearch.json'));
		}
	}]);