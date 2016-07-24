'use strict';

// Declare app level module which depends on views, and components
angular.module('medApp', [
  'ngRoute',
  'medApp.view1',
  'medApp.view2',
  'medApp.login'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
