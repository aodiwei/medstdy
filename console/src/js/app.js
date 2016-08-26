'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('medApp', [
    'ngRoute',
    'angularFileUpload',
    'ui.bootstrap',
    'ngMessages',
    'ui.bootstrap.datetimepicker',
    'ngDialog'
]);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'html/login.html',
                controller: 'loginController'
            })
            .when('/upload-data', {
                templateUrl: 'html/upload-data.html',
                controller: 'uploadController'
            })
            .when('/form-data', {
                templateUrl: 'html/form-tabs/form-data-tabs.html',
                //controller: 'uploadController'
            })
            .otherwise({
                redirectTo: '/login'
            })
    }])
    .run(['$rootScope', 'auth', function ($rootScope, auth) {
        $rootScope.$on('$locationChangeStart', locationChangeStart);

        function locationChangeStart(event) {
            auth.auth().then(function () {
                //$rootScope.leftView = true;
            }).catch(function () {
                //$rootScope.leftView = false;
            });
        }
    }])
    .directive("datePicker", function () {
        return {
            scope: {
                bindModel: "=ngModel",
            },
            transclude: true,
            restrict: "E",
            templateUrl: "../html/widget/datepicker/datepicker.html",
            link: function ($scope, iElm, iAttrs, controllers) {
                $scope.buttonBar = {
                    show: true,
                    now: {
                        show: true,
                        text: '现在'
                    },
                    today: {
                        show: true,
                        text: '今天'
                    },
                    clear: {
                        show: true,
                        text: '清除'
                    },
                    date: {
                        show: true,
                        text: '日期'
                    },
                    time: {
                        show: true,
                        text: '时间'
                    },
                    close: {
                        show: true,
                        text: '确定'
                    }
                };
                $scope.picker_date = {
                    date: new Date(),
                    calendarOptions: {
                        showWeeks: false
                    },
                    enableTime: false
                };

                $scope.openCalendar = function (e) {
                    $scope.open = true;
                };
            }
        }
    })
    .directive("datetimePicker", function () {
        return {
            scope: {
                bindModel: "=ngModel"
            },
            //transclude: true,
            //require: ["^form", "ngModel"],// Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: "E",
            templateUrl: "../html/widget/datepicker/datetimepicker.html",
            link: function ($scope, iElm, iAttrs, controllers) {
                $scope.buttonBar = {
                    show: true,
                    now: {
                        show: true,
                        text: '现在'
                    },
                    today: {
                        show: true,
                        text: '今天'
                    },
                    clear: {
                        show: true,
                        text: '清除'
                    },
                    date: {
                        show: true,
                        text: '日期'
                    },
                    time: {
                        show: true,
                        text: '时间'
                    },
                    close: {
                        show: true,
                        text: '确定'
                    }
                };
                $scope.picker_datetime = {
                    date: new Date(),
                    calendarOptions: {
                        showWeeks: false
                    },
                    enableTime: false
                };

                $scope.openCalendar = function (e) {
                    $scope.open = true;
                };
            }
        }
    });


module.exports = app;
