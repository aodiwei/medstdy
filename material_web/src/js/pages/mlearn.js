/**
 * Created by adw on 2016/12/10.
 */
var app = require('../app.js');
'use strict';

app.controller('recordStatisticCtrl', function ($scope, $mLearn) {
    $scope.mlearnText = "";
    $scope.mlearnResult = "";

    $scope.submit = function(){
        $mLearn.svmMLearn($scope.mlearnText).then(function (req) {
            console.log(req);
            $scope.mlearnResult = req.data;
        });
    };
});