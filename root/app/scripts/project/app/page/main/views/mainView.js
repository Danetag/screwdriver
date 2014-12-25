'use strict';

var $                 = require('jquery'),
    AbstractPageView  = require('abstract/page/pageView'),
    MenuView          = require('page/main/views/menuView'),
    EVENT             = require('event/event'),
    //PopinManager      = require('abstract/popin/popinManager'),
    Backbone          = require('backbone');

var MainView = AbstractPageView.extend(new function (){

  this.el = "body";

  this.idView = 'mainpage';

  /*
   * Instance of Menu View
   * @type {abstract/page/pageView}
   */ 
  this.menuView = null;

  /**
   * Resize breakpoint
   * @type {Number}
   * @private
   */
  this.refWidth = 1280;

  this.initDOM = function() {
    this.$el.addClass('init');
    this.metaViewport = document.querySelector('meta[name=viewport]');
  }

  this.initSubViews = function() {

    this.menuView = new MenuView();
    this.menuView.init();

    //var popinManager = PopinManager.getInstance(); // init

    // Destroy assets references
    this.params.assets.length = 0;
    this.params.assets = {};
  }

  this.render = function() {
    //this.$el.addClass('init');
  }

  this.bindEvents = function() {
    this.listenTo(this.menuView, EVENT.TOGGLE_MENU, $.proxy(_toggleMenu, this));
    
    this.canUpdate = true;
  }

  this.show = function() {
    this.menuView.show();
    AbstractPageView.prototype.show.call(this);
  }

  this.onMouseOut = function(outWindow) {

  }

  this.onResize = function() {
    this.menuView.resize(this.viewport);
  }

  this.onOrientationChange = function() {

    var scale = 1;

    if (this.viewport.width < this.refWidth) {
      scale = this.viewport.width / this.refWidth;
    }

    this.metaViewport.content = "width=device-width, initial-scale="+scale+", maximum-scale="+scale+", user-scalable=yes";
  }

  this.onUpdate = function() {

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
  }

});

module.exports = MainView;