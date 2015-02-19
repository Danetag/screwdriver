var config      = require('getconfig');

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


module.exports = new APIModule();

