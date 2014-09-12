var controller = require('../../../core/Controller');

var homepage = (function() {

  var HomepageController = function() {
    controller.call(this);
  }

  HomepageController.prototype = Object.create(controller.prototype);
  HomepageController.prototype.constructor = HomepageController;

  HomepageController.prototype.indexAction = function(req, res) {
    var params = req.params;
    
    this.datas.base_language = this.config.baseLanguage;
    this.datas.lang = req.getLocale();

    res.render('homepage', this.datas);
  }


  return HomepageController;

})();

module.exports = new homepage();