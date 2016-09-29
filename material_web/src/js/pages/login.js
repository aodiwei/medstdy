/**
 * Created by asus on 2016/9/28.
 */
'use strict';
var app = require('../app.js');

app.controller("LoginCtrl", function($scope, $state){
    $scope.submit = function(){
        $state.go("main");
    }
});