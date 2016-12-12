/**
 * Created by adw on 2016/12/10.
 */
var app = require('../app.js');
'use strict';

app.controller('recordStatisticCtrl', function ($scope, $statistic) {
    $statistic.getRecordStatistic().then(function (req) {
        console.log(req);
        $scope.myDataSource = {
            chart: {
                caption: "贡献值",
                subCaption: "",
                numberPrefix: "",
                theme: "ocean"
            },
            data: []
        };

        var data = req.data;
        for (var item in data) {
            if (item == 0) {
                continue;
            }
            $scope.myDataSource.data.push({
                label: data[item]["dataer"],
                value: data[item]["count"]
            });
        }
    });

    $scope.myDataSource2 = {
        chart: {
            caption: "贡献值",
            subCaption: "",
            numberPrefix: "",
            theme: "ocean"
        },
        data: [{
            label: "Bakersfield Central",
            value: "880000"
        },
            {
                label: "Garden Groove harbour",
                value: "730000"
            },
            {
                label: "Los Angeles Topanga",
                value: "590000"
            },
            {
                label: "Compton-Rancho Dom",
                value: "520000"
            },
            {
                label: "Daly City Serramonte",
                value: "330000"
            }]
    };
});