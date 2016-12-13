/**
 * Created by adw on 2016/12/10.
 */
var app = require('../app.js');
'use strict';

app.controller('recordStatisticCtrl', function ($scope, $statistic) {
    $scope.dataSourceBar = {
        chart: {
            caption: "贡献值",
            subCaption: "",
            numberPrefix: "",
            theme: "ocean"
        },
        data: []
    };

    $scope.dataSource3D = {
        chart: {
            caption: "完成情况",
            subcaption: "贡献率",
            startingangle: "120",
            showlabels: "1",
            showlegend: "1",
            enablemultislicing: "0",
            slicingdistance: "15",
            showpercentvalues: "1",
            showpercentintooltip: "0",
            plottooltext: "$label : $datavalue",
            theme: "fint"
        },
        data: []
    };
    $statistic.getRecordStatistic().then(function (req) {
        console.log(req);
        var data = req.data;
        for (var item in data) {
            if (item == 0) {
                $scope.dataSource3D.data.push({
                    label: "未完成",
                    value: data[item]["count"]
                });
                continue;
            }
            $scope.dataSourceBar.data.push({
                label: data[item]["dataer"],
                value: data[item]["count"]
            });
            $scope.dataSource3D.data.push({
                label: data[item]["dataer"],
                value: data[item]["count"]
            });
        }
    });


});