/**
 * Created by aodiwei on 2016/8/14.
 */
'use strict';
var app = require('./app.js');
var division_conf = require('../config/division.js');
app
    .controller("tabsController", function ($scope, $http) {
        $scope.tabs = [
            {title: '患者基本信息', content: 'html/form-tabs/tab-patient-info.html'},
            {title: '住院病历记录', content: 'html/form-tabs/tab_hospitalized.html'},
            {title: '首次病程记录表', content: 'html/form-tabs/tab_clinical_course.html'},
            {title: '手术记录表', content: 'html/form-tabs/tab_surgery.html'},
            {title: '术后病程', content: 'html/form-tabs/tab_after_surgery.html'},
            {title: '出院记录表', content: 'html/form-tabs/tab_leave.html'},
            {title: '长期医嘱记录表', content: 'html/form-tabs/tab_long_medical_orders.html'},
            {title: '临时医嘱记录表', content: 'html/form-tabs/tab_temp_medical_orders.html'}
        ];

        $scope.model = {
            name: 'Tabs'
        };
        $scope.patient_info = {
            medical_id: "123232",
            name: "javk",
            sex: "女",
            birthday: new Date("2016-08-17 16:00"),
            province: "新疆省",
            city: "克拉玛依市",
            age: 12,
            detail_addr: "xxx",
            marriage: "未婚",
            job: "xxxx",
            in_date: new Date("2016-08-25 15:03:00"),
            out_date: new Date("2016-08-25 15:02:00"),
            outpatient: "dfdfdf"
        };
        //$scope.patient_info = {};
        $scope.clinical_course = {};
        $scope.submit = function () {
            console.log($scope.patient_info);
            //console.log($scope.clinical_course);
            var req = {
                url: '/data/form-data',
                method: 'POST',
                params: {patient_info: $scope.patient_info}
            };

            $http(req).then(function (data) {
                console.log(data)
            }).catch(function () {
                alert("提交失败");
            });
        }
    })
    .controller("tabPatientController", function ($scope) {
        $scope.selected = {
            sex: ['男', '女'],
            division: division_conf,
            marriage: ['已婚', '未婚']
        };
    })
    .controller("tabHospitalizedController", function ($scope) {
    })
    .controller("tabClinicalCourseController", function ($scope) {
        //$scope.clinical_course = {};
        var item = {datetime: "", record: ""};
        $scope.clinical_course = [item];
        $scope.addRecord = function () {
            $scope.clinical_course.push({datetime: "", record: ""});
            console.log($scope.clinical_course);
        };
        $scope.delRecord = function (index) {
            $scope.records.splice(index, 1);
        };
    })
    .controller("tabSurgeryController", function ($scope) {

    })
    .controller("tabAfterSurgeryController", function ($scope) {
        $scope.records = [];
        $scope.index = 0;
        $scope.addRecord = function () {
            $scope.records.push($scope.index);
            $scope.index++;
        };
        $scope.delRecord = function (index) {
            $scope.records.splice(index, 1);
        };
    })
    .controller("tabLongMedicalOrdersController", function ($scope) {
        console.log("long");
        $scope.records = [];
        $scope.index = 0;
        $scope.addRecord = function () {
            $scope.records.push($scope.index);
            $scope.index++;
        };
        $scope.delRecord = function (index) {
            $scope.records.splice(index, 1);
        };
    })
    .controller("tabTempMedicalOrdersController", function ($scope) {
        console.log("temp");
        $scope.records = [];
        $scope.index = 0;
        $scope.addRecord = function () {
            $scope.records.push($scope.index);
            $scope.index++;
        };
        $scope.delRecord = function (index) {
            $scope.records.splice(index, 1);
        };
    });

