/**
 * Created by asus on 2016/9/28.
 */
'use strict';
//node_modules
require('angular');
require('angular-route');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('../../node_modules/angular-material/angular-material.min.css');
require('angular-messages');
require('angular-material-icons');
require('angular-ui-router');
//require('angular-material-datetimepicker');
//require('../../node_modules/angular-material-datetimepicker/js/angular-material-datetimepicker.min.js');


require('../css/app.css');
require('./app');
require('./pages/tabs');
require('./nav/nav');
require('./pages/login');
require('./service/authService');
require('./service/commonFunService');
require('./service/dataService');

require('../html/nav/left_nav.html');
require('../html/pages/p2.html');
require('../html/pages/tabs/tabs.html');
require('../html/pages/tabs/tab-patient-info.html');
require('../html/pages/login/login.html');
