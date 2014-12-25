'use strict';

var $         					= require('jquery'),
    AbstractLoaderView  = require('abstract/loader/loaderView'),
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
   * SO you can hide when the 100% have been reched
   * @type {boolean}
   */
  this.canHide = false;

  this.initDOM = function() {
    this.$bar = this.$loader.find('.bar');
  }

  this.setPct = function(pct) {
    this.pct = pct;

    TweenLite.to(this.$bar, 0.7, { x:(-100 + this.pct)+'%', ease:Cubic.easeOut, onComplete:_checkEnd.bind(this)});
  }

  this.show = function() {
    this.trigger(EVENT.SHOWN);
  }

  this.hide = function() {
    if (this.canHide) _hide.call(this);
    this.canHide = true;
  }

  var _hide = function() {
    setTimeout($.proxy(function(){
      TweenLite.to( this.$loader, 0.3, { autoAlpha:0 , ease:Cubic.easeOut , onComplete:_hidden.bind(this)});
    }, this), 0);
  }

  var _checkEnd = function() {
    if(this.pct === 100) {
      if (this.canHide) _hide.call(this);
      this.canHide = true;
    }
  }

  var _hidden = function() {
    this.trigger(EVENT.HIDDEN);
  }

});


module.exports = LoaderViewBasic;