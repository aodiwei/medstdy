/**
 * Created by asus on 2016/8/20.
 */

var app = require('./app.js');

app.controller("datepickerController", function ($scope) {
    var that = this;
    $scope.model = "patient_info.birthday";

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
    // global config picker
    this.picker_datetime = {
        date: new Date(),
        calendarOptions: {
            showWeeks: false
        }
    };

    this.picker_date = {
        date: new Date(),
        calendarOptions: {
            showWeeks: false
        },
        enableTime: false
    };


    this.openCalendar = function (e, picker) {
        that[picker].open = true;
    };


});