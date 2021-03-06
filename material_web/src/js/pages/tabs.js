/**
 * Created by AO.Diwei on 2016/9/28.
 */
'use strict';
var app = require('../app.js');
// var division_conf = require('../config/division.js');
var test_data = require('../config/test_data.js');
app
    .controller("formTabsCtrl", function ($scope, $http, $commonFun) {
        $scope.tabs = [
            {title: '患者基本信息', content: 'html/pages/tabs/tab_patient_info.html', status: false},
            {title: '住院病历记录', content: 'html/pages/tabs/tab_hospitalized.html', status: false},
            {title: '首次病程记录表', content: 'html/pages/tabs/tab_clinical_course.html', status: false},
            {title: '手术记录表', content: 'html/pages/tabs/tab_surgery.html', status: false},
            {title: '术后病程表', content: 'html/pages/tabs/tab_after_surgery.html', status: false},
            {title: '出院记录表', content: 'html/pages/tabs/tab_leave.html', status: false},
            {title: '长期医嘱记录表', content: 'html/pages/tabs/tab_long_medical_orders.html', status: false},
            {title: '临时医嘱记录表', content: 'html/pages/tabs/tab_temp_medical_orders.html', status: false}
        ];

        $scope.datetime_format = "[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]";
        $scope.date_format = "[1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]";

        $scope.initForm = function (data) {
            if (data == null) {
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
            }
            else {
                for (var item in data) {
                    if (data[item] != null) {
                        $scope[item] = data[item];
                        if (item == "clinical_course") {
                            $scope.check_record = data.clinical_course["check_record"];
                        } else if (item == "after_surgery") {
                            $scope.description = data.after_surgery["description"];
                        } else if (item == "long_medical_orders") {
                            $scope.long_items = data.long_medical_orders["items"];
                        } else if (item == "temp_medical_orders") {
                            $scope.temp_items = data.temp_medical_orders["items"];
                        }
                    }
                }

                // $scope.check_record = data.clinical_course["check_record"];
                // $scope.description = data.after_surgery["description"];
                // $scope.long_items = data.long_medical_orders["items"];
                // $scope.temp_items = data.temp_medical_orders["items"];

            }

        };

        $scope.tab_status = function () {
            var status = true;
            for (var x in $scope.tabs) {
                //console.log(x, $scope.tabs[x], $scope.tabs[x].status);
                status = $scope.tabs[x].status && status;
            }
            //console.log(status);
            return status; //&& $scope.btnDisable;
        };

        $scope.initForm(null);

        $scope.getDiagInfo = function () {
            if ($scope.patient_info.medical_id === undefined || $scope.patient_info.out_date === undefined) {
                $commonFun.showSimpleToast("请输入病案号和出院时间", "error-toast");
                return 0;
            }
            var req = {
                url: '/data/request_data',
                method: 'GET',
                params: {
                    medical_id: $scope.patient_info.medical_id,
                    out_date: $scope.patient_info.out_date,
                }
            };

            $http(req).then(function (req_data) {
                console.log(req_data.data);
                $scope.initForm(req_data.data);
                $commonFun.showSimpleToast("获取成功，请切换到下一页查看", "success-toast");
                $scope.btnDisable = true;
            }).catch(function () {
                $commonFun.showSimpleToast($scope.patient_info.medical_id + ":" + $scope.patient_info.out_date +
                    "获取失败, 请检查输入的病案号和出院日期，可能该病案号未入库", "error-toast");
            });
        };

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

            $scope.clinical_course["check_record"] = $scope.check_record;
            $scope.after_surgery["description"] = $scope.description;
            $scope.long_medical_orders["items"] = $scope.long_items;
            $scope.temp_medical_orders["items"] = $scope.temp_items;

            var req_sub = {
                url: '/data/form-data',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    patient_info: $scope.patient_info,
                    hospitalized: $scope.hospitalized,
                    clinical_course: $scope.clinical_course,
                    after_surgery: $scope.after_surgery,
                    surgery: $scope.surgery,
                    leave: $scope.leave,
                    long_medical_orders: $scope.long_medical_orders,
                    temp_medical_orders: $scope.temp_medical_orders,
                }
            };
            var alt = JSON.stringify(req_sub.params, null, 2);
            //alert(alt);
            console.log(alt);
            //$commonFun.showSimpleToast(alt, "error-toast");


            //判断表单是否填好
            if (!$scope.tab_status()) {
                $commonFun.showSimpleToast("提交失败，请检查表单，确认数据是否完整录入", "error-toast");
                return;
            }


            $http(req_sub).then(function (data_sub) {
                $commonFun.showSimpleToast("提交成功", "success-toast");
                $scope.initForm();
            }).catch(function (data_sub) {
                //console.log(data_sub);
                var msg = JSON.stringify(data_sub, null, 2);
                console.log(msg);
                alert(msg);
                if (data_sub.status == 412) {
                    $commonFun.showSimpleToast("提交失败,此病案号和日期不存在", "error-toast");
                } else {
                    $commonFun.showSimpleToast("提交失败", "error-toast");
                }

            });
        };

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


        $scope.saveTemp = function () {
            $scope.clinical_course["check_record"] = $scope.check_record;
            $scope.after_surgery["description"] = $scope.description;
            $scope.long_medical_orders["items"] = $scope.long_items;
            $scope.temp_medical_orders["items"] = $scope.temp_items;

            var req_sub = {
                url: '/data/save_temp',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    patient_info: $scope.patient_info,
                    hospitalized: $scope.hospitalized,
                    clinical_course: $scope.clinical_course,
                    after_surgery: $scope.after_surgery,
                    surgery: $scope.surgery,
                    leave: $scope.leave,
                    long_medical_orders: $scope.long_medical_orders,
                    temp_medical_orders: $scope.temp_medical_orders,
                }
            };

            $http(req_sub).then(function (data_sub) {
                console.log("临时保存成功");
                console.log(data_sub);
            }).catch(function (data_sub) {
                console.log("临时保存失败");
                console.log(data_sub);
            });
        };

        $scope.getTemp = function () {
            var req = {
                url: '/data/get_temp',
                method: 'GET',
            };

            $http(req).then(function (req_data) {
                console.log("临时数据获取成功");
                console.log(req_data.data);
                $scope.initForm(req_data.data);
            }).catch(function (req_data) {
                console.log("临时数据获取失败");
                console.log(req_data.data);
            });
        };

        //60s自动保存
        // $commonFun.inter($scope.saveTemp, 60000);
        //获取临时保存
        // $scope.getTemp();
});