'use strict';

angular.module('angularApimockApp')
  .controller('DemoSimpleCtrl', function ($scope, $http) {
    $scope.players = [];
    $scope.alerts = [];

    $scope.getHighscore = function() {
      $http.get('/api/scores/top')
        .success(function(data, status) {
          $scope.players = data;
        })
        .error(function(data, status) {
          var msg = 'No connection :( Now add ?apimock=true to the browser addressbar and try again ;)';
          $scope.alerts.push({ type: 'danger', text: msg });
        });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  });
