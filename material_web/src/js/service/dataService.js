/**
 * Created by david ao on 2016/8/6.
 */

'use strict';

var app = require('../app.js');

app.factory('$userInfo', function() {
    var _account = "";
    var _role = "worker";
    var _user_info = {};
    return {
        getAccount: function(){
            //console.log("get", _account);
            return _account;
        },
        setAccount: function(account){
            _account = account;
            //console.log("set", _account);
            return _account;
        },
        getRole: function(){
            return _role;
        },
        setRole: function(role){
            _role = role;
            console.log("role", _role);
        },
        getUserInfo: function(){
            return _user_info;
        },
        setUserInfo: function(user_info){
            for(var key in user_info){
                _user_info[key] = user_info[key];
            }
            this.setRole(_user_info["role"]);
            this.setAccount(_user_info["account"]);
            console.log("set user", user_info);
        }

    }
});

