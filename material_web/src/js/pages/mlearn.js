/**
 * Created by adw on 2016/12/10.
 */
var app = require('../app.js');
'use strict';

app.controller('mLearnCtrl', function ($scope, $mLearn) {
    $scope.mlearnText = "自觉双侧面下部宽大，影响美观3年余";
    $scope.mlearnResult = "";

    $scope.submit = function(){
        $mLearn.svmMLearn($scope.mlearnText).then(function (req) {
            console.log(req);
            $scope.mlearnResult = req.data;
        });
    };
});