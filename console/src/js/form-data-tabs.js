/**
 * Created by aodiwei on 2016/8/14.
 */
'use strict';
var app = require('./app.js');
var division_conf = require('../config/division.js');
app
    .controller("tabsController", function ($scope) {
        $scope.tabs = [
            {title: '患者基本信息', content: 'html/tab-patient-info.html'},
            {title: '住院病历记录', content: 'html/tab_hospitalized.html'}
        ];

        $scope.model = {
            name: 'Tabs'
        };
    })
    .controller("tabPatientController", function ($scope) {
        $scope.selected = {
            sex: ['男', '女'],
            division: division_conf,
            marriage: ['已婚', '未婚']
        };
    })
    .controller("Tab2Ctrl", function ($scope) {
    })
    .controller("Tab3Ctrl", function ($scope) {
    });
