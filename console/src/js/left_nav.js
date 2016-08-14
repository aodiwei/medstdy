/**
 * Created by ao di wei on 2016/8/14.
 */
'use strict';
var app = require('./app.js');
app
    .controller("leftNavController", function ($scope, $http, $location) {
        var req = {
            url: '/user/user_info',
            method: 'GET',
        };
        $http(req).then(function (res) {
            $scope.account = res.data.account;
        }).catch(function () {
            console.log("get user info failed");
        });

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
    });