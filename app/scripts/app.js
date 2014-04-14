'use strict';

angular.module('angularApimockApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',

  'ui.bootstrap',
  'apiMock'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
      .when('/demo-simple', {
        templateUrl: 'views/demo-simple.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
