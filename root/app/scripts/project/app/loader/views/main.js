'use strict';

var $         					= require('jquery'),
    AbstractLoaderView  = require('abstract/loader/loaderView'),
    Backbone  					= require('backbone'),
    _                   = require('underscore'),
    EVENT               = require('event/event'),
    LoaderMainTpl       = require('tpl/loader/main');

var LoaderViewMain = AbstractLoaderView.extend(new function (){

  /*
   * Template of a basic loader
   * @type {template}
   */
  this.template = _.template(LoaderMainTpl);

  this.initDOM = function() {

    this.$pct = this.$loader.find('.pct');
    this.$circle01 = this.$loader.find("#circle01")
    this.$circle02 = this.$loader.find("#circle02")
    this.$circle03 = this.$loader.find("#circle03")
    this.$circle04 = this.$loader.find("#circle04")
  
    TweenLite.set( this.$circle01, { rotation:200, transformOrigin : "17px 17px"});
    TweenLite.set( this.$circle02, { rotation:360});
    TweenLite.set( this.$circle03, { rotation:560, transformOrigin : "55.5px 55.5px"});
    TweenLite.set( this.$circle04, { rotation:720});

  }

  this.setPct = function(pct) {
    this.pct = pct;

    TweenLite.to( this.$circle01 , .2, { rotation:200-(200*this.pct/100)});
    TweenLite.to( this.$circle02 , .2, { rotation:360-(360*this.pct/100)});
    TweenLite.to( this.$circle03 , .2, { rotation:560-(560*this.pct/100)});
    TweenLite.to( this.$circle04 , .2, { rotation:720-(720*this.pct/100)});

    //this.$pct.html(this.pct + "%");

  }

  this.show = function() {
    TweenLite.to( this.$loader, 0.7, { autoAlpha:1 , ease:Cubic.easeOut , onComplete:_shown.bind(this)});
  }

  this.hide = function() {
    setTimeout($.proxy(function(){
      TweenLite.to( this.$loader, 0.7, { autoAlpha:0 , ease:Cubic.easeOut , onComplete:_hidden.bind(this)});
    }, this), 2000);
    
  }

  var _shown = function() {
    this.trigger(EVENT.SHOWN);
  }

  var _hidden = function() {
    this.trigger(EVENT.HIDDEN);
  }

});


module.exports = LoaderViewMain;