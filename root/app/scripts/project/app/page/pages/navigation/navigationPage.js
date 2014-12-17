'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    NavigationView      = require('page/pages/navigation/views/navigationView'),
    Backbone            = require('backbone');

var NavigationPage = function (){

  AbstractPage.call(this);
  this.id = 'navigation';

};

_.extend(NavigationPage, AbstractPage);
_.extend(NavigationPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
NavigationPage.prototype.instanceView = function() {
  this.view = new NavigationView();
}

module.exports = NavigationPage;