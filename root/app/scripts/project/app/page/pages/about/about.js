'use strict';

var $               = require('jquery'),
    _               = require('underscore'),
    AbstractPage    = require('abstract/page'),
    AboutView       = require('page/pages/about/views/aboutView'),
    Backbone        = require('backbone');

var AboutPage = function (){

  AbstractPage.call(this);
  this.id = 'about';

}

_.extend(AboutPage, AbstractPage);
_.extend(AboutPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
AboutPage.prototype.instanceView = function() {
  this.view = new AboutView();
}


module.exports = AboutPage;