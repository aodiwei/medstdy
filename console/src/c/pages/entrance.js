"use strict";

module.exports = function(UserService, ConfigService) {
    console.log("entrance...")
  UserService.getMe()
  .then(function(me) {
    console.log(me);
  })
  .catch(function(res) {
    if (res.status >= 500) {
      alert("server error.");
    }
  });
};