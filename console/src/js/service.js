/**
 * Created by david ao on 2016/8/6.
 */

'use strict';

var app = require('./app.js');

app.service('auth', function ($location, $http, $q, fData) {
    this.auth = function () {
        var defer = $q.defer();
        var currentUrl = $location.url();
        if (currentUrl == '/login'|| currentUrl == '') {
            console.log(currentUrl, 'ignore auth');
            defer.reject(false);
            fData.setLeftNav(false);
            return defer.promise;
        }else {
            fData.setLeftNav(true);
        }
        var config = {
            url: "/user/auth",
            method: "GET"
        };
        $http(config).then(function () {
            console.log($location.absUrl(), "success");
            defer.resolve(true);
        }).catch(function () {
            $location.path("/login");
            alert("请先登录");
            defer.reject(false)
        });
        return defer.promise
    };
});

app.factory('fData', function() {
    var _leftNav = false;
    var _account = "";
    return {
        getLeftNav: function () {
            return _leftNav;
        },
        setLeftNav: function(flag){
            _leftNav = flag;
            return _leftNav;
        },
        getAccount: function(){
            console.log("get", _account);
            return _account;
        },
        setAccount: function(account){
            _account = account;
            console.log("set", _account);
            return _account;
        }
    }
});
