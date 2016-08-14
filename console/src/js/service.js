/**
 * Created by david ao on 2016/8/6.
 */

'use strict';

var app = require('./app.js');

app.service('auth', function ($location, $http, $q) {

    this.auth = function () {
        var defer = $q.defer();
        var currentUrl = $location.url();
        if (currentUrl == '/login'|| currentUrl == '') {
            console.log(currentUrl, 'ignore auth');
            var promise = defer.promise;
            defer.reject(false);
            return promise;
        }
        var config = {
            url: "/user/auth",
            method: "GET"
        };
        var promise = $http(config).then(function () {
            console.log($location.absUrl(), "success");
            defer.resolve(true)
        }).catch(function () {
            $location.path("/login");
            alert("请先登录");
            defer.reject(false)
        });
        return promise
    }
});