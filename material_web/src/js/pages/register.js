/**
 * Created by david ao on 2016/8/27.
 */
var app = require("../app.js");
'use strict';

app.controller("registerCtrl", function($scope, $http, $state, $commonFun){
    $scope.selected = {
        roles: [{option:"管理员", value: "admin"}, {option:"数据管理员", value:"worker"}],
    };

    $scope.btnDisable = false;
    $scope.register_info = {};

    $scope.registerFun = function(){
        $scope.btnDisable = true;
        var req = {
            url: "/user/register",
            method: "POST",
            params: {
                email: $scope.register_info.email,
                account: $scope.register_info.account,
                password: $scope.register_info.password,
                password_confirm: $scope.register_info.password_confirm,
                role: $scope.register_info.role,
                //image: $scope.image,
            }
        };

        $http(req).then(function (data) {
            $commonFun.showSimpleToast("注册成功", "success-toast");
            $state.reload();
            $scope.btnDisable = false;
        }).catch(function (data) {
            $commonFun.showSimpleToast("注册失败:" + data.data.error, "error-toast");
            //$commonFun.showSimpleToast(data.data.error, "error-toast");
            $scope.btnDisable = false;
        });
    };
});