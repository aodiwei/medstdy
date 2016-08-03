/**
 * Created by AO.Diwei on 2016/8/3.
 */
var configs = {
    user_host_local: "http://localhost:8000/",
    data_host_local: "http://localhost:8001/",
    user_host_online: "http://42.159.244.119:8000/",
    data_host_online: "http://42.159.244.119:8001/"
};

module.exports = function(){
    var p = navigator.platform;
    var configure = {};
    if(p.indexOf("Win") == 0){
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