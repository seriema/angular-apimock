function getUrlParameterByName(name) {
	name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
		results = regex.exec(location.search);
	return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var OFFLINE = getUrlParameterByName('offline') === 'true';

function demand(file) {
	var result;
	$.ajax(file, { async: false, type: 'GET' }).done(function (data) {
		result = data;
	});

	return result;
}

angular.module('angularOfflineApp', [])

	.config(['$provide', function ($provide) {
		if (OFFLINE) {
			var se = document.createElement('script');
			se.type = 'text/javascript';
			se.text = demand('/Content/js/vendor/angular-1.2.9/angular-mocks.js');
			document.getElementsByTagName('head')[0].appendChild(se);

			$provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
		}
	}])

	.run(['$injector', function ($injector) {
		if (OFFLINE) {
			var $httpBackend = $injector.get('$httpBackend');

			$httpBackend.when('POST', '/api/Basket').respond(demand('/Content/js/data/post.basket.json'));
			$httpBackend.when('GET', new RegExp('/api/ProductSearch(\.*)')).respond(demand('/Content/js/data/get.productsearch.json'));

			$httpBackend.when('GET', '/Content/js/data/stores.json').respond(demand('/Content/js/data/stores.json'));
			$httpBackend.when('GET', '/Content/js/app/storefinder/storefinder.tpl.html').respond(demand('/Content/js/app/storefinder/storefinder.tpl.html'));
			$httpBackend.when('GET', '/Content/js/app/findbeverage/categories/categorycard.tpl.html').respond(demand('/Content/js/app/findbeverage/categories/categorycard.tpl.html'));
			$httpBackend.when('GET', '/Content/js/data/categories.json').respond(demand('/Content/js/data/categories.json'));
			$httpBackend.when('GET', '/Content/js/app/order/orderlist-item.tpl.html').respond(demand('/Content/js/app/order/Directives/sbOrderList-item.tpl.html'));
		}
	}]);