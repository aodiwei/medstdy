/**
 * Created by AO.Diwei on 2016/8/3.
 */
var configs = {
    user_host_local: "http://localhost",
    data_host_local: "http://localhost",
    user_host_online: "http://42.159.244.119",
    data_host_online: "http://42.159.244.119"
};

module.exports = function(){
    //var p = navigator.platform;
    var configure = {};
    var curhost = window.location.host;
    if(curhost.indexOf("localhost") == 0){
        configure = {
            user_host: configs.user_host_local,
            data_host: configs.data_host_local
        };
    }else {
        configure = {
            user_host: configs.user_host_online,
            data_host: configs.data_host_online
        };
    }

    return configure;
};