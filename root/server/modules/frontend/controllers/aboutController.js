var controller = require('../core/Controller');

var AboutController = function() {
	controller.call(this);
}

AboutController.prototype = Object.create(controller.prototype);
AboutController.prototype.constructor = AboutController;

AboutController.prototype.indexAction = function(req, res) {
	res.render('about', this.datas);
}

module.exports = new AboutController();