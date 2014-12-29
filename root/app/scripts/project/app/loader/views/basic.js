'use strict';

var $         					= require('jquery'),
    AbstractLoaderView  = require('abstract/view/DOM/loader/loaderView'),
    Backbone  					= require('backbone'),
    EVENT               = require('event/event'),
    dot                 = require('dot'),
    LoaderBasicTpl      = require('loader/basic.html');

var LoaderViewBasic = AbstractLoaderView.extend(new function (){

  /*
   * Template of a basic loader
   * @type {template}
   */
  this.template = dot.template(LoaderBasicTpl);

  /*
   * So you can hide when the 100% has been reached
   * @type {boolean}
   */
  this.canHide = false;


});


LoaderViewBasic.prototype.initDOM = function() {
  this.$bar = this.$el.find('.bar');
  TweenLite.set( this.$el, { autoAlpha:0});
}

LoaderViewBasic.prototype.setPct = function(pct) {
  this.pct = pct;

  TweenLite.to(this.$bar, 0.7, { x:(-100 + this.pct)+'%', ease:Cubic.easeOut, onComplete:_checkEnd.bind(this)});
}

LoaderViewBasic.prototype.show = function() {
  TweenLite.to( this.$el, 0.3, { autoAlpha:1 , ease:Cubic.easeOut , onComplete:_shown.bind(this)});
}

LoaderViewBasic.prototype.hide = function() {
  if (this.canHide) _hide.call(this);
  this.canHide = true;
}


var _hide = function() {
  setTimeout($.proxy(function(){
    TweenLite.to( this.$el, 0.3, { autoAlpha:0 , ease:Cubic.easeOut , onComplete:_hidden.bind(this)});
  }, this), 0);
}

var _checkEnd = function() {
  if(this.pct === 100) {
    if (this.canHide) _hide.call(this);
    this.canHide = true;
  }
}

var _shown = function() {
  AbstractLoaderView.prototype.show.call(this);
}

var _hidden = function() {
  AbstractLoaderView.prototype.hide.call(this);
}



module.exports = LoaderViewBasic;