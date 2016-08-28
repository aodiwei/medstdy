'use strict';
var app = require('./app.js');

app
    .controller('loginController', function ($scope, $http, $location, fData, modal) {
        $scope.user = {};
        $scope.sign = function () {
            var config = {
                url: '/user/login',
                method: 'POST',
                params: {user_name: $scope.user.account, password: $scope.user.password}
            };
            $http(config).success(function (data) {
                //alert("登录成功");
                console.log(data);
                fData.setUserInfo(data);
                modal.openTimed("登录成功", modal.type.success);
                $location.path("/upload-data");
            }).error(function () {
                modal.openTimed("登录失败", modal.type.failed);
            });
        };
    })

    .controller('carouselController', function ($scope) {
        $scope.myInterval = 3000;
        $scope.noWrapSlides = false;
        $scope.active = 1;
        $scope.slides = [
            {
                image: "img/s1.png",
                text: " ",
                id: 0
            },
            {
                image: "img/s2.png",
                text: "",
                id: 1
            },
            {
                image: "img/s3.png",
                text: "",
                id: 2
            }
        ];

    });


