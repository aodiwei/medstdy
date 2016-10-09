/**
 * Created by AO.Diwei on 2016/10/8.
 */
'use strict';

var app = require('../app.js');

app.service('$auth', function ($location, $http, $q, $userInfo, $state, $commonFun) {
    this.auth = function () {
        var defer = $q.defer();
        var currentUrl = $location.url();
        if (currentUrl == '/login'|| currentUrl == '') {
            //console.log(currentUrl, 'ignore auth');
            defer.reject(true);
            return defer.promise;
        }
        var account = $userInfo.getAccount();
        console.debug("xxxx",account);
        if(account === ""){
            $commonFun.showSimpleToast('请登录', 'error-toast');
            //console.log($location.absUrl(), 'go');
            //$state.go('login');
            defer.reject(false)
        }else {
            defer.resolve(true);
        }

        return defer.promise;

        //var config = {
        //    url: '/user/auth',
        //    method: 'GET'
        //};
        //$http(config).then(function (data) {
        //    $userInfo.setUserInfo(data.data);
        //    console.log('server', data.data);
        //    console.log($location.absUrl(), 'success');
        //    defer.resolve(true);
        //}).catch(function () {
        //    $commonFun.showSimpleToast('请登录', 'error-toast');
        //    $state.go('login');
        //    defer.reject(false)
        //});
        //return defer.promise
    };
});