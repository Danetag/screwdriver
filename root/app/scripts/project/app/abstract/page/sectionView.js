'use strict';

var $                 = require('jquery'),
    EVENT             = require('event/event'),
    AbstractPageView  = require('abstract/page/pageView'),
    Carousel          = require('abstract/carousel/carouselView'),
    FooterView        = require('page/main/views/footerView'),
    Backbone          = require('backbone');

var SectionView = AbstractPageView.extend(new function (){

  /**
   * Carousel
   * @type {abstract/carousel/carouselView}
   * @private
   */
  this.carousel = null;

  this.footerView = null;

  this.percentPositionInit = false;


  /**
   * Resize breakpoint
   * @type {Number}
   * @private
   */
  this.refWidth = 1280;

  this.initDOM = function() {
    this.$header = this.$el.find('header');
    this.$contentTips = this.$el.find('header');
    this.$stepSection = this.$el.find('.steps-section');
    
    this.initCarousel();
    this.initFooter();
  }

  this.initCarousel = function() {
    this.carousel = new Carousel({carousel: this.$el.find('.carousel')});
  }

  this.initFooter = function() {
    this.footerView = new FooterView();
    this.$el.append(this.footerView.$el);
  }

  this.onResize = function() {
    this.$header.height(this.viewport.height);

    this.carousel.resize(this.viewport);

     /* Custom */

     /*

    _initEl.call(this);

    var scale = 1;
    var heightStepSection = this.$stepSection.data('height');

    if (this.viewport.width < this.refWidth) {
      scale = this.viewport.width / this.refWidth;
      
      // font
      if (scale <= 0.6) scale = 0.6;

      heightStepSection = (this.$stepSection.data('height') * scale);

    } 

    var cssContent = {scaleX:scale, scaleY:scale, scaleZ:scale};

    if (scale < 1) {
      cssContent.position = "absolute";
      cssContent.top = -( heightStepSection - (this.$stepSection.data('height') * scale) ) / 2;
    } else {
      cssContent.position = "static";
      cssContent.top = 0;
    }


    TweenLite.set(this.$stepSection, {height: heightStepSection});
    TweenLite.set(this.$stepSection.find('.content'), cssContent);
    */

  }

  var _initEl = function() {
    if (this.percentPositionInit) return;

    this.percentPositionInit = true;

    var height = parseInt(this.$stepSection.height());

    console.log('>>>height', height)

    this.$stepSection.data('height', height);
  }

  this.show = function() {
    this.goToContent(_onShown.bind(this));
  }

  this.hide = function() {
    TweenLite.to(window, 0.5, {scrollTo:{y:0, x:0}, ease:Power2.easeInOut, onComplete:_onHidden.bind(this)});
  }

  this.onUpdate = function() {
    if (this.carousel != null) this.carousel.update();
  }

  this.goToContent = function(callback) {
    setTimeout($.proxy(function(){
      if (callback != undefined) TweenLite.to(window, 0.7, {scrollTo:{y:this.viewport.height, x:0}, ease:Power2.easeInOut, onComplete:callback});
      else TweenLite.to(window, 0.7, {scrollTo:{y:this.viewport.height, x:0}, ease:Power2.easeInOut});
    }, this), 0);
  }

  this.dispose = function() {

    this.footerView.dispose();
    this.footerView = null;

    this.carousel.dispose();
    this.carousel = null;

    AbstractPageView.prototype.dispose.call(this);
  }


  var _onShown = function() {
    this.canUpdate = true;

    this.carousel.show();

    this.trigger(EVENT.SHOWN);
  }

  var _onHidden = function() {
    this.canUpdate = false;
    this.trigger(EVENT.HIDDEN);
  }

});


module.exports = SectionView;