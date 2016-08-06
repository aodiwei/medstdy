'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('medApp', [
        'ngRoute',
        'angularFileUpload',
        'ui.bootstrap'
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
            .otherwise({
                redirectTo: '/login'
            })
    }])

    .run(['$rootScope', 'auth', function ($rootScope, auth) {
    $rootScope.$on('$locationChangeStart', locationChangeStart);

    function locationChangeStart(event) {
        auth.auth();
    }
}]);

module.exports = app;
