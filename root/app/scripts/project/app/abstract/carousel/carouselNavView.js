'use strict';

var $               = require('jquery'),
    _               = require('underscore'),
    CarouselNavTpl  = require('tpl/carousel/navigation'),
    CAROUSEL_EVENT  = require('abstract/carousel/carouselEvent'),
    AbstractView    = require('abstract/view'),
    Backbone        = require('backbone');

var AbstractCarouselNavView = AbstractView.extend(new function (){

  this.events = {
    'click li': 'onButtonClick'
  }

  this.template = _.template(CarouselNavTpl);

  this.initialize = function(options) {
    AbstractView.prototype.initialize.call(this, options);

    this.initDOM();
  }

  this.initDOM = function() {

    this.$left = this.$el.find('li[data-direction=ltr]');
    this.$right = this.$el.find('li[data-direction=rtl]');

    TweenLite.set(this.$left, {x: -100, autoAlpha:0 });
    TweenLite.set(this.$right, {x: 100, autoAlpha:0 });
  }

  this.show = function() {

    TweenLite.to(this.$left, .3, { x:0, autoAlpha:1, ease:Cubic.easeOut, onComplete:_onShown.bind(this) })
    TweenLite.to(this.$right, .3, { x:0, autoAlpha:1, delay:.1, ease:Cubic.easeOut })

  }

  this.hide = function() {
    AbstractView.prototype.hide.call(this);
  }

  this.render = function() {
    this.el = this.template();
    this.$el = $(this.el);
  }

  this.onButtonClick = function(e) {
    this.trigger(CAROUSEL_EVENT.NAVIGATION, {direction: $(e.currentTarget).data('direction')})
  }

  var _onShown = function() {
    AbstractView.prototype.show.call(this);
  }

});


module.exports = AbstractCarouselNavView;