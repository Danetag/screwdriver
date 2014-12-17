'use strict';

var $               = require('jquery'),
    EVENT           = require('event/event'),
    _               = require('underscore'),
    CAROUSEL_EVENT  = require('abstract/carousel/carouselEvent'),
    AbstractView    = require('abstract/view'),
    Backbone        = require('backbone');

var AbstractCarouselItemView = AbstractView.extend(new function (){

  this.initialize = function(options) {

    /**
     * Element
     * @type {$element}
     * @private
     */
    this.$el = options.carouselItem;

    this.dataId = this.$el.data('id');

    AbstractView.prototype.initialize.call(this, options);

    this.init();
  }

  this.render = function() {
    this.el = this.$el[0];
  }

  this.init = function() {
    this.initDOM();
    this.initTL();
    this.bindEvents();
  }

  this.initDOM = function() {

    this.$h3Subtitle = this.$el.find('h3 .subtitle');
    this.$h3Title = this.$el.find('.title');
    this.$p = this.$el.find('article p');
    this.$imgs = this.$el.find('.details img');
    this.$buttons = this.$el.find('.details button');
    this.$lisInfos = this.$el.find('ul li');

    //console.log('this.$h3Subtitle', this.$h3Subtitle);

    TweenLite.set(this.$h3Subtitle, {y: -5, autoAlpha:0 });
    TweenLite.set(this.$h3Title, {y: -10, autoAlpha:0 });
    TweenLite.set(this.$p, {y: -10, autoAlpha:0 });
    TweenLite.set(this.$imgs, {x: -20, autoAlpha:0 });
    TweenLite.set(this.$buttons, {x: -10, autoAlpha:0 });
    TweenLite.set(this.$lisInfos, {y: -10, autoAlpha:0 });

  }

  this.initTL = function(){

    this.destroyTL();

    this.TL = {};

    // Show
    this.TL.show = new TimelineLite({paused: true});

    this.TL.show.to(this.$h3Subtitle, .3, {y:0, autoAlpha:1, ease:Cubic.easeOut}, 0)
                .to(this.$h3Title, .3, {y:0, autoAlpha:1, ease:Cubic.easeOut}, '-=.1');

    $.each(this.$p, $.proxy(function(i, item){
      var $p = $(item);
      this.TL.show.to($p, .3, {y:0, autoAlpha:1, ease:Cubic.easeOut}, '-=.1');
    }, this));

    $.each(this.$imgs, $.proxy(function(i, item){
      var $img = $(item);
      this.TL.show.to($img, .3, {x:0, autoAlpha:1, ease:Cubic.easeOut}, '-=.2');
    }, this));

    $.each(this.$buttons, $.proxy(function(i, item){
      var $button = $(item);
      this.TL.show.to($button, .3, {x:0, autoAlpha:1, ease:Cubic.easeOut}, '-=.2');
    }, this));

    $.each(this.$lisInfos, $.proxy(function(i, item){
      var $li = $(item);
      this.TL.show.to($li, .3, {y:0, autoAlpha:1, ease:Cubic.easeOut}, '-=.3');
    }, this));

    this.TL.show.call($.proxy(function(){
      AbstractView.prototype.show.call(this);
    }, this));

    //Hide
    this.TL.hide = new TimelineLite({paused: true});

    this.TL.hide.to(this.$h3Subtitle, .3, {autoAlpha:0, ease:Cubic.easeOut}, 0)
                .to(this.$h3Title, .3, {autoAlpha:0, ease:Cubic.easeOut}, 0);

    $.each(this.$p, $.proxy(function(i, item){
      var $p = $(item);
      this.TL.hide.to($p, .3, {autoAlpha:0, ease:Cubic.easeOut}, 0);
    }, this));

    $.each(this.$imgs, $.proxy(function(i, item){
      var $img = $(item);
      this.TL.hide.to($img, .3, { autoAlpha:0, ease:Cubic.easeOut}, 0);
    }, this));

    $.each(this.$buttons, $.proxy(function(i, item){
      var $button = $(item);
      this.TL.hide.to($button, .3, { autoAlpha:0, ease:Cubic.easeOut}, 0);
    }, this));

    $.each(this.$lisInfos, $.proxy(function(i, item){
      var $li = $(item);
      this.TL.hide.to($li, .3, { autoAlpha:0, ease:Cubic.easeOut}, 0);
    }, this));

    this.TL.hide.call($.proxy(function(){
      AbstractView.prototype.hide.call(this);
    }, this));

    
  }

  this.onResize = function() {

  };

  this.onUpdate = function() {

  };

  this.bindEvents = function() {
    
  };

  this.unbindEvents = function() {

  };

  this.show = function() {
    this.initDOM();
    this.initTL();
    this.TL.show.play();
  }

  this.hide = function() {
    this.TL.hide.play();
  }

  this.dispose = function() {
    this.unbindEvents();
    AbstractView.prototype.dispose.call(this);
  }




});


module.exports = AbstractCarouselItemView;