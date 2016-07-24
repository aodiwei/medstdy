'use strict';

angular.module('medApp.version', [
  'medApp.version.interpolate-filter',
  'medApp.version.version-directive'
])

.value('version', '0.1');
