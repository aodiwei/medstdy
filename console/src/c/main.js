"use strict";

require("angular");
require("angular-route");

var app = angular.module("teamworkConsole",
                         [
                            "ngRoute",
                         ]);
app
.service('ConfigService', require("../m/service/configure"))
.service('UserService', require("../m/service/userservice"))
.controller('entrance', require("./pages/entrance.js"))
;

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/entrance", 
          {
            controller: "entrance",
            template: require("../v/pages/entrance.html"),
          })
    .when("/",
          {
            redirectTo: "/entrance",
          })
    ;
})
;

module.exports = app;