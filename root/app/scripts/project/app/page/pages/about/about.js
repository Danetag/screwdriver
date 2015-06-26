'use strict';

var AbstractController  = require('abstract/controller/controller'),
    AboutView       		= require('page/pages/about/views/aboutView');



var AboutPage = function (){
  AbstractController.call(this);
}

_.extend(AboutPage, AbstractController);
_.extend(AboutPage.prototype, AbstractController.prototype);



/*
 * @overrided
 */
AboutPage.prototype.instanceView = function() {
	AbstractController.prototype.instanceView.call(this);
  this.view = new AboutView({}, this.datas);
}


module.exports = AboutPage;