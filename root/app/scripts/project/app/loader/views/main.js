'use strict';

var $         					= require('jquery'),
    AbstractLoaderView  = require('abstract/loader/loaderView'),
    Backbone  					= require('backbone'),
    EVENT               = require('event/event'),
    dot                 = require('dot'),
    LoaderMainTpl       = require('loader/main.html');

var LoaderViewMain = AbstractLoaderView.extend(new function (){

  /*
   * Template of a basic loader
   * @type {template}
   */
  this.template = dot.template(LoaderMainTpl);

  this.initDOM = function() {

    this.$pct = this.$loader.find('.pct');

  }

  this.setPct = function(pct) {
    this.pct = pct;
    this.$pct.html(this.pct + "%");
  }

  this.show = function() {
    TweenLite.to( this.$loader, 0.7, { autoAlpha:1 , ease:Cubic.easeOut , onComplete:_shown.bind(this)});
  }

  this.hide = function() {
    TweenLite.to( this.$loader, 0.7, { autoAlpha:0 , ease:Cubic.easeOut , onComplete:_hidden.bind(this)});
  }

  var _shown = function() {
    this.trigger(EVENT.SHOWN);
  }

  var _hidden = function() {
    this.trigger(EVENT.HIDDEN);
  }

});


module.exports = LoaderViewMain;