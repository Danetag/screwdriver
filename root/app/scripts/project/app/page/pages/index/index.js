'use strict';

var AbstractController    = require('abstract/controller/controller'),
    IndexView             = require('page/pages/index/views/indexView');



var IndexPage = function (){
  AbstractController.call(this);
}

_.extend(IndexPage, AbstractController);
_.extend(IndexPage.prototype, AbstractController.prototype);



/*
 * @overrided
 */
IndexPage.prototype.instanceView = function() {
	AbstractController.prototype.instanceView.call(this);
  this.view = new IndexView({}, this.datas);
}


module.exports = IndexPage;