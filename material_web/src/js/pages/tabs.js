/**
 * Created by AO.Diwei on 2016/9/28.
 */
'use strict';
var app = require('../app.js');
// var division_conf = require('../config/division.js');
// var test_data = require('../config/test_data.js');
app
    .controller("formTabsCtrl", function ($scope, $http, $commonFun) {
        $scope.tabs = [
            {title: '患者基本信息', content: 'html/pages/tabs/tab_patient_info.html', status: false},
            {title: '住院病历记录', content: 'html/pages/tabs/tab_hospitalized.html', status: false},
            {title: '首次病程记录表', content: 'html/pages/tabs/tab_clinical_course.html', status: false},
            {title: '手术记录表', content: 'html/pages/tabs/tab_surgery.html', status: false},
            {title: '术后病程', content: 'html/pages/tabs/tab_after_surgery.html', status: false},
            {title: '出院记录表', content: 'html/pages/tabs/tab_leave.html', status: false},
            {title: '长期医嘱记录表', content: 'html/pages/tabs/tab_long_medical_orders.html', status: false},
            {title: '临时医嘱记录表', content: 'html/pages/tabs/tab_temp_medical_orders.html', status: false}
        ];

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
        };

        $scope.tab_status =function(){
            var status = true;
            for(var x in $scope.tabs){
                //console.log(x, $scope.tabs[x], $scope.tabs[x].status);
                status = $scope.tabs[x].status && status;
            }
            return status;
        };

        $scope.initForm();

        //for debug
        // $scope.patient_info = test_data.tbl_patient_info;
        // $scope.clinical_course = test_data.tbl_clinical_course;
        // $scope.hospitalized = test_data.tbl_hospitalized;
        // $scope.surgery = test_data.tbl_surgery;
        // $scope.after_surgery = test_data.tbl_after_surgery;
        // $scope.leave = test_data.tbl_leave;
        // $scope.check_record = test_data.tbl_clinical_course.check_record;
        // $scope.description = test_data.tbl_after_surgery.description;
        // $scope.long_items = test_data.tbl_long_medical_orders.items;
        // $scope.temp_items = test_data.tbl_temp_medical_orders.items;

        $scope.submit = function () {
            //判断表单是否填好
            if(!$scope.tab_status()){
                $commonFun.showSimpleToast("提交失败，请检查表单，确认数据是否完整录入", "error-toast");
                return;
            }

            $scope.clinical_course["check_record"] = $scope.check_record;
            $scope.after_surgery["description"] = $scope.description;
            $scope.long_medical_orders["items"] = $scope.long_items;
            $scope.temp_medical_orders["items"] = $scope.temp_items;

            // console.log($scope.patient_info.birthday);
            // console.log($scope.patient_info);
            // console.log($scope.clinical_course);
            // console.log($scope.hospitalized);
            // console.log($scope.surgery);
            // console.log($scope.leave);
            // console.log($scope.long_medical_orders);
            // console.log($scope.temp_medical_orders);

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

        //patient
        $scope.selected = {
            sex: ['男', '女'],
            // division: division_conf,
            marriage: ['已婚', '未婚', '丧偶', '离婚', '其他']
        };

        //clinical course
        $scope.addCheckItem = function () {
            $scope.check_record.push({date: "", content: ""});
        };

        $scope.delCheckItem = function (index) {
            $scope.check_record.splice(index, 1);
        };

        //After Surgery
        $scope.addDesItem = function () {
            $scope.description.push({date: "", content: ""});
        };
        $scope.delDesItem = function (index) {
            $scope.description.splice(index, 1);
        };

        //Long Medical Orders
        $scope.addLongItem = function () {
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
        $scope.delLongItem = function (index) {
            $scope.long_items.splice(index, 1);
        };

        //Temp Medical Orders
        $scope.addTempItem = function () {
            $scope.temp_items.push({
                start_datetime: "",
                medical_order: "",
                start_execute_doctor: "",
                start_execute_nurse: "",
                start_execute_datetime: "",
                checker: ""
            });
        };
        $scope.delTempItem = function (index) {
            $scope.temp_items.splice(index, 1);
        };

    });