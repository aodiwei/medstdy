'use strict';
var app = require("../app.js");
app.controller('showDataCtrl', function ($http, $mdEditDialog, $q, $timeout, $scope, $commonFun, $mdDialog) {


        $scope.options = {
            rowSelection: true,
            multiSelect: false,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: false,
            pageSelect: true
        };

        $scope.selected = [];
        $scope.limitOptions = [5, 10, 15, {
            label: 'All',
            value: function () {
                return $scope.desserts ? $scope.desserts.count : 0;
            }
        }];

        $scope.query = {
            order: '_id',
            limit: 50,
            page: 1,
            filter: '_id',
            search_type: '_id',
            search: ''
        };
        $scope.filter = {
            options: {
                debounce: 500
            },
            search: ''
        };

        $scope.search_type_select = {
            '_id': 'ID',
            'name': '姓名',
            'dataer': '录入者',
            'main_diagnosis': '主要诊断',
            'main_surgery': '主要手术'
        };


        /////////////////////
        $scope.getBaseInfoList = function (skip, limit) {
            var req = {
                url: '/data/request_base_info_list',
                method: 'GET',
                params: {
                    skip: skip,
                    limit: limit,
                    field: $scope.query.search_type,
                    query: $scope.query.search
                }
            };
            $http(req).then(function (req_data) {
                $scope.desserts = req_data.data;
            }).catch(function () {
                $commonFun.showSimpleToast("获取数据失败", "error-toast");
            });

        };
        $scope.getBaseInfoList(0, 50);


        $scope.editComment = function (event, dessert) {
            event.stopPropagation();

            var dialog = {
                // messages: {
                //   test: 'I don\'t like tests!'
                // },
                modelValue: dessert.comment,
                placeholder: 'Add a comment',
                save: function (input) {
                    dessert.comment = input.$modelValue;
                },
                targetEvent: event,
                title: 'Add a comment',
                validators: {
                    'md-maxlength': 30
                }
            };

            var promise = $scope.options.largeEditDialog ? $mdEditDialog.large(dialog) : $mdEditDialog.small(dialog);

            promise.then(function (ctrl) {
                var input = ctrl.getInput();

                input.$viewChangeListeners.push(function () {
                    input.$setValidity('test', input.$modelValue !== 'test');
                });
            });
        };

        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        $scope.getTypes = function () {
            return ['Candy', 'Ice cream', 'Other', 'Pastry'];
        };

        $scope.onPaginate = function (page, limit) {
            console.log('Scope Page: ' + $scope.query.page + ' Scope Limit: ' + $scope.query.limit);
            console.log('Page: ' + page + ' Limit: ' + limit);

            $scope.promise = $timeout(function () {
                $scope.getBaseInfoList((page - 1) * limit, limit)
            }, 2000);
        };


        $scope.deselect = function (item) {
            console.log(item.name, 'was deselected');
        };

        $scope.selectedItem = "";
        $scope.log = function (item) {
            $scope.selectedItem = item._id;
            console.log(item.name, 'was selected');
        };

        $scope.loadStuff = function () {
            $scope.promise = $timeout(function () {
                $scope.query.search_type = '_id';
                $scope.query.search = '';
                $scope.onPaginate(1, 50);
                $scope.query.page = 1;
            }, 2000);
        };

        $scope.onReorder = function (order) {

            console.log('Scope Order: ' + $scope.query.order);
            console.log('Order: ' + order);

            $scope.promise = $timeout(function () {

            }, 2000);
        };


        $scope.customFullscreen = true;
        $scope.showDetail = function (ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/html/pages/show_data/show_details.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {selectedItem: $scope.selectedItem},
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        };
        function DialogController($scope, $mdDialog, selectedItem) {

            $scope.selectedItem = selectedItem;
            $scope.initForm = function (data) {
                if (data == null) {
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
                            if (item == "patient_info") {
                                $scope[item].sex = $scope[item].sex == 1 ? "男" : "女";
                                $scope[item].marriage = $scope[item].marriage == 2 ? "已婚" : "未婚";
                                $scope[item].outpatient = $scope[item].outpatient.diagnosis;
                            }
                            else if (item == "clinical_course") {
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
                }
            };

            $scope.getDetailData = function () {
                var selectedItem = $scope.selectedItem.split("_");
                var medical_id = selectedItem[0];
                var out_date = selectedItem[1];
                var req = {
                    url: '/data/request_data',
                    method: 'GET',
                    params: {
                        medical_id: medical_id,
                        out_date: out_date
                    }
                };

                $http(req).then(function (req_data) {
                    console.log(req_data.data);
                    $scope.initForm(req_data.data);
                }).catch(function () {
                    $commonFun.showSimpleToast($scope.selectedItem + "获取失败", "error-toast");
                });
            };

            $scope.initForm();
            $scope.getDetailData();

            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }

    }
);