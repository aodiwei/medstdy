'use strict';
var configure_mod = require('../config/configure.js');
var configure = new configure_mod();

angular.module('medApp.login', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', function($scope, $http, $location) {
  $scope.user = {account: "eagle", password: "zaq1xsw2"};
  //$scope.user = {};
  $scope.sign = function () {
        var config = {
            url: configure.user_host + "/user/login",
            method: "POST",
            params: {user_name: $scope.user.account, password: $scope.user.password}
        };
        $http(config).success(function (data, status, headers, config) {
            alert("登录成功");
            $location.path("/upload-data");
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
  $scope.myInterval = 3000;
  $scope.noWrapSlides = false;
  $scope.active = 1;
  $scope.slides = [
      {
          image: "img/s1.png",
          text: " ",
          id: 0
      },
      {
          image: "img/s2.png",
          text: "",
          id: 1
      },
      {
          image: "img/s3.png",
          text: "",
          id: 2
      }
  ];

});

