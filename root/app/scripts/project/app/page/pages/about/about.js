'use strict';

var $               		= require('jquery'),
    _               		= require('underscore'),
    AbstractController    	= require('abstract/controller/controller'),
    AboutView       		= require('page/pages/about/views/aboutView'),
    Backbone        		= require('backbone');

var AboutPage = function (){

  AbstractController.call(this);
  this.id = 'about';

}

_.extend(AboutPage, AbstractController);
_.extend(AboutPage.prototype, AbstractController.prototype);

/*
 * @overrided
 */
AboutPage.prototype.instanceView = function() {
  this.view = new AboutView();
}


module.exports = AboutPage;