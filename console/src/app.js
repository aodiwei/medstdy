'use strict';

// Declare app level module which depends on views, and components
angular.module('medApp', [
  'ngRoute',
  'medApp.login',
  'ui.bootstrap'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}])


//.controller('NavBarCtrl', function($scope) {
//
//    $scope.isCollapsed = true;
//});