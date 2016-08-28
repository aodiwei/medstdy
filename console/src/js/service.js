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
            //console.log(currentUrl, 'ignore auth');
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
        $http(config).then(function (data) {
            fData.setUserInfo(data.data);
            console.log("server", data.data);
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
    var _role = "worker";
    var _user_info = {};
    return {
        getLeftNav: function () {
            return _leftNav;
        },
        setLeftNav: function(flag){
            _leftNav = flag;
            return _leftNav;
        },
        getAccount: function(){
            //console.log("get", _account);
            return _account;
        },
        setAccount: function(account){
            _account = account;
            //console.log("set", _account);
            return _account;
        },
        getRole: function(){
            return _role;
        },
        setRole: function(role){
            _role = role
            console.log("role", _role);
        },
        getUserInfo: function(){
            return _user_info;
        },
        setUserInfo: function(user_info){
            for(var key in user_info){
                _user_info[key] = user_info[key];
            }
            this.setRole(_user_info["role"]);
            this.setAccount(_user_info["account"]);
            console.log("set user", user_info);
        }

    }
});

app.service("modal", function(ngDialog){
    this.type = {
        success: "custom-success",
        failed: "custom-fail",
    };
    //模态对话框
    this.openTimed = function (modalTip, type) {
        var dialog = ngDialog.open({
            template: modalTip,
            plain: true,
            closeByDocument: false,
            closeByEscape: false,
            className: 'ngdialog-theme-default ' + type,
        });
        setTimeout(function () {
            dialog.close();
        }, 2000);
    };
});