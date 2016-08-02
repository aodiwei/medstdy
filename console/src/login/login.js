'use strict';

var host = "http://localhost:8000/";
angular.module('medApp.login', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', function($scope, $http) {
  //$scope.user = {account: "eagle", password: "zaq1xsw2"};$scope.user = {};
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
})

//.directive('panel1', function ($compile) {
//            return {
//                restrict: "E",
//                replace:false,
//                transclude: true,
//                templateUrl:"../node_modules/angular-ui-bootstrap/template/carousel/carousel.html",
//                //templateUrl:"./login/temp.html",
//
//            }
//        })

.controller('CarouselDemoCtrl', function ($scope) {
  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 1;
  $scope.slides = [
      {
          image: "img/s1.png",
          text: "good ",
          id: 0
      },
      {
          image: "img/s2.png",
          text: "very",
          id: 1
      },
      {
          image: "img/s3.png",
          text: "就是这样",
          id: 2
      }
  ];

});

