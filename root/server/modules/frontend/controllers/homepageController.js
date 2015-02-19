var controller  = require('../core/Controller')
    config      = require('getconfig');

var HomepageController = function() {
  controller.call(this);
}

HomepageController.prototype = Object.create(controller.prototype);
HomepageController.prototype.constructor = HomepageController;

HomepageController.prototype.indexAction = function(req, res) {
  var params = req.params;
  
  this.datas.base_language = config.frontend.baseLanguage;
  this.datas.lang = req.getLocale();

  res.render('homepage', this.datas);
}


module.exports = new HomepageController();