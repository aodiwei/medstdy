/**
 * Created by adw on 2016/12/10.
 */
var app = require('../app.js');
'use strict';

app.controller('recordStatisticCtrl', function ($scope, $statistic) {
    $statistic.getRecordStatistic().then(function (req) {
        console.log(req);
        $scope.labels = [];
        $scope.data = [[]];
        var data = req.data;
        for(var item in data){
            if(item == 0){
                continue;
            }
            $scope.labels.push(data[item]["dataer"]);
            $scope.data[0].push(data[item]["count"]);
        }
        $scope.series = ["贡献值"]
    });
});