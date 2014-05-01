'use strict';

angular.module('angularApimockApp')

  .config(function(apiMockProvider) {
    apiMockProvider.config({
      mockDataPath: 'mock_data',
      apiPath: 'api'
    });
  })

  .controller('DemoSimpleCtrl', function ($scope, $http) {
    $scope.players = [];
    $scope.alerts = [];

    $scope.getHighscore = function() {
      $http.get('api/scores/top')
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
