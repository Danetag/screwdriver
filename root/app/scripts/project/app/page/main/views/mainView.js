'use strict';

var $                 = require('jquery'),
    AbstractPageView  = require('abstract/page/pageView'),
    MenuView          = require('page/main/views/menuView'),
    BuyNowView        = require('page/main/views/buyNowView'),
    EVENT             = require('event/event'),
    SliderView        = require('page/main/views/slider/sliderView'),
    PopinManager      = require('abstract/popin/popinManager'),
    Backbone          = require('backbone');

var MainView = AbstractPageView.extend(new function (){

  this.el = "body";

  this.idView = 'mainpage';

  /*
   * Instance of Menu View
   * @type {abstract/page/pageView}
   */ 
  this.menuView = null;

  /*
   * Instance of Buy Now View
   * @type {abstract/page/pageView}
   */ 
  this.buyNowView = null;

  /*
   * Instance of Slider View
   * @type {abstract/page/pageView}
   */ 
  this.sliderView = null;

  /**
   * Resize breakpoint
   * @type {Number}
   * @private
   */
  this.refWidth = 1280;

  this.isSettingUp = false;

  this.initDOM = function() {
    this.$el.addClass('init');
    this.metaViewport = document.querySelector('meta[name=viewport]');
  }

  this.initSubViews = function() {

    this.menuView = new MenuView();
    this.menuView.init();

    var popinManager = PopinManager.getInstance(); // init

    this.buyNowView = new BuyNowView();
    this.buyNowView.init();

    var sliderAssets = this.getAssetsByID(this.params.assets, 'slides');
    this.sliderView = new SliderView({slides: this.configView.slides, assets: sliderAssets, interactions : this.configView.interactions});
    this.sliderView.init();
    
    // Destroy assets references
    this.params.assets.length = 0;
    this.params.assets = {};
  }

  this.render = function() {
    //this.$el.addClass('init');
  }

  this.bindEvents = function() {
    this.listenTo(this.sliderView, EVENT.GO_TO_CONTENT, $.proxy(_goToContent, this));
    this.listenTo(this.sliderView, EVENT.TOGGLE_MENU, $.proxy(_toggleMenu, this));
    this.listenTo(this.menuView, EVENT.TOGGLE_MENU, $.proxy(_toggleMenu, this));
    
    this.canUpdate = true;
  }

  this.show = function() {
    this.listenToOnce(this.sliderView, EVENT.SHOWN, _sliderViewShown.bind(this));

    this.menuView.show();
    this.sliderView.show();
  }

  this.onMouseOut = function(outWindow) {
    if (this.sliderView != null) this.sliderView.onMouseOut(outWindow);
  }

  this.onResize = function() {
    this.menuView.resize(this.viewport);
    this.sliderView.resize(this.viewport);

    /* Custom */
    /*
    var scale = 1;

    if (this.viewport.width < this.refWidth) {
      scale = this.viewport.width / this.refWidth;
    } 

    if (this.isSettingUp) return;

    this.isSettingUp = true;
    var self = this;
    setTimeout(function(){
      this.isSettingUp = false;
      self.metaViewport.content = "width=device-width, initial-scale="+scale+", maximum-scale="+scale+", user-scalable=yes";
    }, 300)
    */
    

  }

  this.onOrientationChange = function() {

    var scale = 1;

    if (this.viewport.width < this.refWidth) {
      scale = this.viewport.width / this.refWidth;
    }

    this.metaViewport.content = "width=device-width, initial-scale="+scale+", maximum-scale="+scale+", user-scalable=yes";
  }

  this.onUpdate = function() {
    if (this.sliderView != null) this.sliderView.update();
  }

  this.toggleMenu = function() {
    _toggleMenu.call(this);
  }

  /* 
   * @override
   * do nothing.
   */
  this.dispose = function() {}


  var _toggleMenu = function() {
    this.$el.toggleClass('nav-shown');
    this.sliderView.toggleMenu();
  }


  var _sliderViewShown = function() {
    this.trigger(EVENT.SHOWN);
  }

  var _goToContent = function(e) {
    var id = e.id;
    this.trigger(EVENT.GO_TO_CONTENT, {id:id});
  }

});

module.exports = MainView;