'use strict';

var $         					= require('jquery'),
    AbstractLoaderView  = require('abstract/loader/loaderView'),
    Backbone  					= require('backbone'),
    EVENT               = require('event/event');

var LoaderViewEmpty = AbstractLoaderView.extend(new function (){

  // Override because no element to display
  this.render = function() {}

  this.show = function() {
    this.trigger(EVENT.SHOWN);
  }

  this.hide = function() {
    this.trigger(EVENT.HIDDEN);
  }

});


module.exports = LoaderViewEmpty;