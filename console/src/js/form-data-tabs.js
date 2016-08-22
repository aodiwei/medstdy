/**
 * Created by aodiwei on 2016/8/14.
 */
'use strict';
var app = require('./app.js');
var division_conf = require('../config/division.js');
var test_data = require('../config/test_data.js');
app
    .controller("tabsController", function ($scope, $http) {
        $scope.tabs = [
            {title: '患者基本信息', content: 'html/form-tabs/tab-patient-info.html'},
            //{title: '住院病历记录', content: 'html/form-tabs/tab_hospitalized.html'},
            //{title: '首次病程记录表', content: 'html/form-tabs/tab_clinical_course.html'},
            //{title: '手术记录表', content: 'html/form-tabs/tab_surgery.html'},
            //{title: '术后病程', content: 'html/form-tabs/tab_after_surgery.html'},
            //{title: '出院记录表', content: 'html/form-tabs/tab_leave.html'},
            //{title: '长期医嘱记录表', content: 'html/form-tabs/tab_long_medical_orders.html'},
            //{title: '临时医嘱记录表', content: 'html/form-tabs/tab_temp_medical_orders.html'}
        ];

        $scope.model = {
            name: 'Tabs'
        };

        $scope.patient_info = {};
        $scope.hospitalized = {};
        $scope.clinical_course = {};
        $scope.after_surgery = {};
        $scope.surgery = {};
        $scope.leave = {};
        $scope.long_medical_orders = {};
        $scope.temp_medical_orders = {};

        $scope.check_record = [{date: "", content: ""}];
        $scope.description = [{date: "", content: ""}];

        $scope.long_items = [{
            start_datetime: "",
            medical_order: "",
            start_execute_doctor: "",
            start_execute_nurse: "",
            start_execute_datetime: "",
            stop_datetime: "",
            stop_execute_doctor: "",
            stop_execute_nurse: "",
            stop_execute_datetime: ""
        }];

        $scope.temp_items = [{
            start_datetime: "",
            medical_order: "",
            start_execute_doctor: "",
            start_execute_nurse: "",
            start_execute_datetime: "",
            checker: "",
        }];

        // for debug
        //$scope.patient_info = test_data.tbl_patient_info;
        //$scope.clinical_course = test_data.tbl_clinical_course;
        //$scope.hospitalized = test_data.tbl_hospitalized;
        //$scope.surgery = test_data.tbl_surgery;
        //$scope.after_surgery = test_data.tbl_after_surgery;
        //$scope.leave = test_data.tbl_leave;
        //
        //$scope.check_record = test_data.tbl_clinical_course.check_record;
        //$scope.long_items = test_data.tbl_long_medical_orders.items;
        //$scope.temp_items = test_data.tbl_temp_medical_orders.items;
        //$scope.patient_info.birthday = "x";

        $scope.submit = function () {
            $scope.clinical_course["check_record"] = $scope.check_record;
            $scope.after_surgery["description"] = $scope.description;
            $scope.long_medical_orders["items"] = $scope.long_items;
            $scope.temp_medical_orders["items"] = $scope.temp_items;

            console.log($scope.patient_info.birthday);
            console.log($scope.patient_info);
            console.log($scope.clinical_course);
            console.log($scope.hospitalized);
            console.log($scope.surgery);
            console.log($scope.leave);
            console.log($scope.long_medical_orders);
            console.log($scope.temp_medical_orders);

            var req = {
                url: '/data/form-data',
                method: 'POST',
                params: {
                    tbl_patient_info: $scope.patient_info,
                    tbl_hospitalized: $scope.hospitalized,
                    tbl_clinical_course: $scope.clinical_course,
                    tbl_after_surgery: $scope.after_surgery,
                    tbl_surgery: $scope.surgery,
                    tbl_leave: $scope.leave,
                    tbl_long_medical_orders: $scope.long_medical_orders,
                    tbl_temp_medical_orders: $scope.temp_medical_orders,
                }
            };

            //$http(req).then(function (data) {
            //    console.log(data)
            //}).catch(function () {
            //    console.log("提交失败");
            //});
        }
    })
    .controller("tabPatientController", function ($scope) {
        $scope.selected = {
            sex: ['男', '女'],
            division: division_conf,
            marriage: ['已婚', '未婚', '丧偶', '离婚', '其他']
        };
    })

    .controller("tabHospitalizedController", function ($scope) {

    })

    .controller("tabClinicalCourseController", function ($scope) {
        $scope.addRecord = function () {
            $scope.check_record.push({date: "", content: ""});
        };

        $scope.delRecord = function (index) {
            $scope.check_record.splice(index, 1);
        };
    })

    .controller("tabSurgeryController", function ($scope) {

    })

    .controller("tabAfterSurgeryController", function ($scope) {
        $scope.addRecord = function () {
            $scope.description.push({date: "", content: ""});
        };
        $scope.delRecord = function (index) {
            $scope.description.splice(index, 1);
        };
    })

    .controller("tabLongMedicalOrdersController", function ($scope) {
        $scope.addRecord = function () {
            $scope.long_items.push({
                start_datetime: "",
                medical_order: "",
                start_execute_doctor: "",
                start_execute_nurse: "",
                start_execute_datetime: "",
                stop_datetime: "",
                stop_execute_doctor: "",
                stop_execute_nurse: "",
                stop_execute_datetime: ""
            });
        };
        $scope.delRecord = function (index) {
            $scope.long_items.splice(index, 1);
        };
    })

    .controller("tabTempMedicalOrdersController", function ($scope) {
        $scope.addRecord = function () {
            $scope.temp_items.push({
                start_datetime: "",
                medical_order: "",
                start_execute_doctor: "",
                start_execute_nurse: "",
                start_execute_datetime: "",
                checker: ""});
        };
        $scope.delRecord = function (index) {
            $scope.temp_items.splice(index, 1);
        };
    });

