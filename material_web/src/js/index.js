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
require('font-awesome-webpack');

require('../third_party/datetimepicker/md-date-time.css');
require('../third_party/datetimepicker/md-date-time');
require('../third_party/datetimepicker/datetimepicker.css');
require('../third_party/datetimepicker/datetimepicker');

require('../css/app.css');
require('./app');
require('./pages/tabs');
require('./nav/nav');
require('./pages/login');
require('./service/authService');
require('./service/commonFunService');
require('./service/dataService');

require('./config/division');
require('./config/test_data');

require('../html/pages/login/login.html');

require('../html/nav/left_nav.html');
require('../html/pages/p2.html');
require('../html/pages/tabs/tabs.html');
require('../html/pages/tabs/tab_patient_info.html');
require('../html/pages/tabs/tab_hospitalized.html');
require('../html/pages/tabs/tab_clinical_course.html');
require('../html/pages/tabs/tab_surgery.html');
require('../html/pages/tabs/tab_after_surgery.html');
require('../html/pages/tabs/tab_leave.html');
require('../html/pages/tabs/tab_temp_medical_orders.html');
require('../html/pages/tabs/tab_long_medical_orders.html');

require('../html/pages/admin/register.html');



require('../html/widget/check_record.html');
require('../html/widget/after_surgery_record.html');
 require('../html/widget/long_medical_orders.html');
 require('../html/widget/temp_medical_orders.html');
