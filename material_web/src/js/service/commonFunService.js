/**
 * Created by AO.Diwei on 2016/10/8.
 */
'use strict';

var app = require('../app.js');

app.service("$commonFun", function($mdToast){
    this.showSimpleToast = function(text, theme) {
        //theme 只能是success-toast/error-toast，要拓展需要去css里添加类
        $mdToast.show(
          $mdToast.simple()
            .textContent(text)
            .position('bottom right')
            .theme(theme)
            .hideDelay(5000)
        );
      };
});
