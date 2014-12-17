'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    HydrationView       = require('page/pages/hydration/views/hydrationView'),
    Backbone            = require('backbone');

var HydrationPage = function (){

  AbstractPage.call(this)
  this.id = 'hydration';

};

_.extend(HydrationPage, AbstractPage);
_.extend(HydrationPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
HydrationPage.prototype.instanceView = function() {
  this.view = new HydrationView();
}

module.exports = HydrationPage;