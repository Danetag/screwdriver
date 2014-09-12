var mod = (function() {

  var APIModule = function() {

    this.app = null;

  }

  APIModule.prototype = {

    init: function(app) {

      this.app = app;

      this.initRouting();
    },

    initRouting: function() {


    }

  }

  return APIModule;
  
})();

module.exports = new mod();

