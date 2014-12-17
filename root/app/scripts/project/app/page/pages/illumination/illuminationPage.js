'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    IlluminationView    = require('page/pages/illumination/views/illuminationView'),
    Backbone            = require('backbone');

var IlluminationPage = function (){

  AbstractPage.call(this);

  this.id = 'illumination';

};

_.extend(IlluminationPage, AbstractPage);
_.extend(IlluminationPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
IlluminationPage.prototype.instanceView = function() {
  this.view = new IlluminationView();
}

module.exports = IlluminationPage;