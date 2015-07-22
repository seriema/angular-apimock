'use strict';

angular.module('angularApimockApp')

  .config(function(apiMockProvider) {
    apiMockProvider.config({
      mockDataPath: 'mock_data',
      apiPath: 'api'
    });
  })

  .controller('DemoBigCtrl', function ($scope, $http) {
    $scope.players = [];
    $scope.alerts = [];

    $scope.getCards = function() {
      $http.get('api/magic-game/cards/all')
        .success(function(data) {
          $scope.players = data;
        })
        .error(function() {
          var msg = 'No connection :( Now add ?apimock=true to the browser addressbar and try again ;)';
          $scope.alerts.push({ type: 'danger', text: msg });
        });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  });
