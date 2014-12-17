'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    StartView   = require('page/pages/start/views/startView'),
    Backbone            = require('backbone');

var StartPage = function (){

  AbstractPage.call(this)
  this.id = 'start';

};

_.extend(StartPage, AbstractPage);
_.extend(StartPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
StartPage.prototype.instanceView = function() {
  this.view = new StartView();
}

module.exports = StartPage;