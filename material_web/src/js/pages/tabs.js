/**
 * Created by AO.Diwei on 2016/9/28.
 */
'use strict';
var app = require('../app.js');
var division_conf = require('../config/division.js');
var test_data = require('../config/test_data.js');
app
    .controller("formTabsCtrl", function ($scope, $http, $commonFun) {
        $scope.tabs = [
            {title: '患者基本信息', content: 'html/pages/tabs/tab_patient_info.html', icon: 'glyphicon-user'},
            {title: '住院病历记录', content: 'html/pages/tabs/tab_hospitalized.html', icon: 'glyphicon-dashboard'},
            {title: '首次病程记录表', content: 'html/pages/tabs/tab_clinical_course.html', icon: 'glyphicon-check'},
            {title: '手术记录表', content: 'html/pages/tabs/tab_surgery.html', icon: 'glyphicon-heart'},
            {title: '术后病程', content: 'html/pages/tabs/tab_after_surgery.html', icon: 'glyphicon-book'},
            {title: '出院记录表', content: 'html/pages/tabs/tab_leave.html', icon: 'glyphicon-edit'},
            {title: '长期医嘱记录表', content: 'html/pages/tabs/tab_long_medical_orders.html', icon: 'glyphicon-list-alt'},
            {title: '临时医嘱记录表', content: 'html/pages/tabs/tab_temp_medical_orders.html', icon: 'glyphicon-list'}
        ];

        $scope.model = {
            name: 'Tabs'
        };

        $scope.initForm = function () {
            $scope.btnDisable = false;
            //表
            $scope.patient_info = {};
            $scope.hospitalized = {};
            $scope.clinical_course = {};
            $scope.after_surgery = {};
            $scope.surgery = {};
            $scope.leave = {};
            $scope.long_medical_orders = {};
            $scope.temp_medical_orders = {};

            // 动态增加的条目
            $scope.check_record = [{date: "", content: ""}, {date: "", content: ""}];
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
        };

        $scope.initForm();

        //for debug
        $scope.patient_info = test_data.tbl_patient_info;
        $scope.clinical_course = test_data.tbl_clinical_course;
        $scope.hospitalized = test_data.tbl_hospitalized;
        $scope.surgery = test_data.tbl_surgery;
        $scope.after_surgery = test_data.tbl_after_surgery;
        $scope.leave = test_data.tbl_leave;
        $scope.check_record = test_data.tbl_clinical_course.check_record;
        $scope.description = test_data.tbl_after_surgery.description;
        $scope.long_items = test_data.tbl_long_medical_orders.items;
        $scope.temp_items = test_data.tbl_temp_medical_orders.items;

        $scope.submit = function () {
            $scope.btnDisable = true;
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

            $http(req).then(function (data) {
                $scope.btnDisable = false;
                $commonFun.showSimpleToast("提交成功", "success-toast");
                $scope.initForm();
            }).catch(function () {
                $scope.btnDisable = false;
                $commonFun.showSimpleToast("提交失败", "error-toast");
            });
        }
    })
    .controller("tabPatientCtrl", function ($scope) {
        $scope.selected = {
            sex: ['男', '女'],
            division: division_conf,
            marriage: ['已婚', '未婚', '丧偶', '离婚', '其他']
        };
    })

    .controller("tabHospitalizedCtrl", function ($scope) {

    })

    .controller("tabClinicalCourseCtrl", function ($scope) {
        $scope.addRecord = function () {
            $scope.check_record.push({date: "", content: ""});
        };

        $scope.delRecord = function (index) {
            $scope.check_record.splice(index, 1);
        };
    })
    //
    //.controller("tabSurgeryController", function ($scope) {
    //
    //})
    //
    .controller("tabAfterSurgeryCtrl", function ($scope) {
        $scope.addRecord = function () {
            $scope.description.push({date: "", content: ""});
        };
        $scope.delRecord = function (index) {
            $scope.description.splice(index, 1);
        };
    })

    .controller("tabLongMedicalOrdersCtrl", function ($scope) {
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

    .controller("tabTempMedicalOrdersCtrl", function ($scope) {
        $scope.addRecord = function () {
            $scope.temp_items.push({
                start_datetime: "",
                medical_order: "",
                start_execute_doctor: "",
                start_execute_nurse: "",
                start_execute_datetime: "",
                checker: ""
            });
        };
        $scope.delRecord = function (index) {
            $scope.temp_items.splice(index, 1);
        };
    });
