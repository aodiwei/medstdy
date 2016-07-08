"use strict";


module.exports = function($http, $q){
  this.configs = null;
  var svc = this;
  this.getConfigs = function() {
    var defer = $q.defer();
    if (svc.configs) {
      defer.resolve(svc.configs);
    }
    else {
      var req = {
        url: "config/config.json",
        method: "GET",
      };
      $http(req)
      .then(
        function(response) {
          svc.configs = response.data;
          defer.resolve(svc.configs);
        },
        function(response) {
          defer.reject(response);
        }
      );
    }
    return defer.promise;
  };
  this.wrappedHttp = function(req) {
    if (!req.url) {
      throw new error("Missing url");
    }
    var defer = $q.defer();
    this.getConfigs()
    .then(function(configs) {
      if (req.url.startsWith("/"))
        req.url = configs.apiHost + req.url;
      $http(req)
      .then(function(response) {
        defer.resolve(response);
      })
      .catch(function(response) {
        defer.reject(response);
      });
    })
    .catch(function(response) {
      defer.reject(response);
    });
    return defer.promise;
  };
}
;