'use strict';

var host = "http://localhost:8000/";
angular.module('medApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', function($scope, $http) {
  $scope.user = {account: "eagle", password: "zaq1xsw2"};
  $scope.sign = function () {
        var config = {
            url: host + "login",
            method: "POST",
            params: {user_name: $scope.user.account, password: $scope.user.password}
        };
        $http(config).success(function (data, status, headers, config) {
            alert("登录成功");
        }).error(function (data, status, headers, config) {
            alert("登录失败");
        });
    };
});
