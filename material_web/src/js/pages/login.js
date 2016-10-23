/**
 * Created by asus on 2016/9/28.
 */
'use strict';
var app = require('../app.js');

app.controller('LoginCtrl', function ($scope, $state, $http, $commonFun, $userInfo) {
    $scope.user = {};
    $scope.submit = function () {
        var config = {
            url: '/user/login',
            method: 'POST',
            params: {user_name: $scope.user.account, password: $scope.user.password}
        };
        $http(config).success(function (data) {
            console.log(data);
            $userInfo.setUserInfo(data);
            $commonFun.showSimpleToast('登录成功', 'success-toast');
            $state.go('main');
        }).error(function (data) {
            $commonFun.showSimpleToast('登录失败，请检查用户名或密码', 'error-toast');
        });
    };

});

app.controller('bodyCtrl', function ($scope, $state) {
    $scope.$state = $state;
});