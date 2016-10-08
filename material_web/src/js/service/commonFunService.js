/**
 * Created by AO.Diwei on 2016/10/8.
 */
'use strict';

var app = require('../app.js');

app.service("$commonFun", function($mdToast){
    this.showSimpleToast = function(text, theme) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(text)
            .position('bottom right')
            .theme(theme)
            .hideDelay(3000)
        );
      };
});
