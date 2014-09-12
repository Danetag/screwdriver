var controller = require('../../../core/Controller');

var index = (function() {

  var IndexController = function() {
    controller.call(this);
  }

  IndexController.prototype = Object.create(controller.prototype);
  IndexController.prototype.constructor = IndexController;

  IndexController.prototype.indexAction = function(req, res) {
    var params = req.params;
    res.render('index', this.datas);
  }

  return IndexController;

})();

module.exports = new index();