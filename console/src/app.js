'use strict';

// Declare app level module which depends on views, and components
angular.module('medApp', [
  'ngRoute',
  'medApp.login'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
