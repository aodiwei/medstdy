'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('medApp', [
        'ngRoute',
        'medApp.login',
        'medApp.upload-data'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'html/login.html',
                controller: 'loginCtrl'
            })
            .when('/upload-data', {
                templateUrl: 'html/upload-data.html',
                controller: 'uploadController'
            })
            .otherwise({
                redirectTo: '/login'
            })
    }]);
