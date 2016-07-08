"use strict";

module.exports = function($http, $q, $location, ConfigService){
  var svc = this;
  this.getMe = function() {
    var defer = $q.defer();
    if (svc.me) {
      defer.resolve(svc.me);
    }
    else {
      ConfigService.getConfigs()
      .then(function(configs) {
        console.log(configs);
        var req = {
          url: configs.apiHost + "/user/self",
          method: "GET",
        };
        $http(req)
        .then(function(response) {
          svc.me = response.data;
          console.log(svc.me);
          defer.resolve(svc.me);
        },
        function(response) {
          console.log(response);
          if (response.status === 401) {
            var next = $location.path();
            if (next !== "/login")
              $location.path("/login").search({next: next});
          }
          defer.reject(response);
        })
      })
      .catch(function(res) {
        console.log(res);
      });
    }
    return defer.promise;
  };
}
;