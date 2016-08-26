/**
 * Created by david ao on 2016/7/31.
 */

'use strict';

//node_modules
require('angular');
require('angular-route');
require('angular-ui-bootstrap');
require('angular-file-upload');
require('angular-messages');
require('bootstrap-ui-datetime-picker');
//require('ng-dialog');

//custom js
require('./app');
require('./login');
require('./upload-data');
require('./service');
require('./left_nav');
require('./form-data-tabs');
require('../config/angular-locale_zh-cn');
require('../config/division.js');
require('../config/test_data.js');

require('./datepicker');

require('../html/nav/left_nav.html');
require('../html/nav/top_nav.html');

require('../html/login.html');
require('../html/upload-data.html');

require('../html/form-tabs/form-data-tabs.html');
require('../html/form-tabs/tab-patient-info.html');
require('../html/form-tabs/tab_clinical_course.html');
require('../html/form-tabs/tab_hospitalized.html');
require('../html/form-tabs/tab_surgery.html');
require('../html/form-tabs/tab_after_surgery.html');
require('../html/form-tabs/tab_leave.html');
require('../html/form-tabs/tab_temp_medical_orders.html');
require('../html/form-tabs/tab_long_medical_orders.html');

require('../html/widget/check_record.html');
require('../html/widget/after_surgery_record.html');
require('../html/widget/long_medical_orders.html');
require('../html/widget/temp_medical_orders.html');
require('../html/widget/datepicker/datepicker.html');
require('../html/widget/datepicker/datetimepicker.html');

require('../css/app.css');
require('../css/buttons.css');

//ngDialog
require('../../node_modules/ng-dialog/css/ngDialog.css');
require('../../node_modules/ng-dialog/css/ngDialog-theme-default.css');
require('../../node_modules/ng-dialog/css/ngDialog-theme-plain.css');
require('../../node_modules/ng-dialog/css/ngDialog-custom-width.css');
require('../../node_modules/ng-dialog/js/ngDialog.js');

