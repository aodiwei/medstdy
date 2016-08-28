/**
 * Created by ao di wei on 2016/8/14.
 */
'use strict';
var app = require('./app.js');
app
    .controller("leftNavController", function ($scope, $http, $location, fData) {
        $scope.left_nav = fData.getLeftNav;
        $scope.account = fData.getAccount;
        $scope.role = fData.getRole;

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.logout = function () {
            var req = {
                url: '/user/logout',
                method: 'POST',
            };
            $http(req).then(function (res) {
                console.log("logout");
                $location.path("/login");
            }).catch(function () {
                console.log("logout failed");
            });

        };
    })

    .controller("contentController", function($scope, fData){
        $scope.left_nav = fData.getLeftNav;
    });