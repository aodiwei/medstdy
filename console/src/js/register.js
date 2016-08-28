/**
 * Created by david ao on 2016/8/27.
 */
var app = require("./app.js");

app.controller("registerController", function($scope, $http, modal){
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
        console.log(req.params);
        //return
        $http(req).then(function (data) {
            var modalTip = "<p>注册成功</p>";
            console.log(modalTip);
            modal.openTimed(modalTip, modal.type.success);
            $scope.register_info = {};
            $scope.btnDisable = false;
        }).catch(function () {
            console.log("提交失败");
            var modalTip = "<p>注册失败</p>";
            modal.openTimed(modalTip, modal.type.failed);
            $scope.btnDisable = false;
        });
    };
});