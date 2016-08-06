/**
 * Created by david ao on 2016/8/6.
 */

'use strict';

var app = require('./app.js');

app.service('auth', function ($location, $http) {
    this.auth = function () {
        if ($location.url() == '/login') {
            console.log('/login ignore auth');
            return;
        }
        var config = {
            url: "/user/auth",
            method: "GET"
        };
        $http(config).success(function () {
            console.log($location.absUrl(), "success");
        }).error(function () {
            $location.path("/login");
            alert("请先登录");
        });
    }
});