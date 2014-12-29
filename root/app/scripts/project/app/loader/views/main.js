'use strict';

var $         					= require('jquery'),
    AbstractLoaderView  = require('abstract/view/DOM/loader/loaderView'),
    Backbone  					= require('backbone'),
    EVENT               = require('event/event'),
    dot                 = require('dot'),
    _                   = require('underscore'),
    LoaderMainTpl       = require('loader/main.html');

var LoaderViewMain = AbstractLoaderView.extend(new function (){

  /*
   * Template of a basic loader
   * @type {template}
   */
  this.template = dot.template(LoaderMainTpl);

  /*
   * Percent DOM Element
   * @type {$}
   */
  this.$pct = null;

});



LoaderViewMain.prototype.initDOM = function() {
  this.$pct = this.$el.find('.pct');
}

LoaderViewMain.prototype.setPct = function(pct) {
  this.pct = pct;
  this.$pct.html(this.pct + "%");
}

LoaderViewMain.prototype.show = function() {
  TweenLite.to( this.$el, 0.7, { autoAlpha:1 , ease:Cubic.easeOut , onComplete:_shown.bind(this)});
}

LoaderViewMain.prototype.hide = function() {
  TweenLite.to( this.$el, 0.7, { autoAlpha:0 , ease:Cubic.easeOut , onComplete:_hidden.bind(this)});
}

var _shown = function() {
  this.trigger(EVENT.SHOWN);
}

var _hidden = function() {
  this.trigger(EVENT.HIDDEN);
}


module.exports = LoaderViewMain;