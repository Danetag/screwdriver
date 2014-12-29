'use strict';

var $                 = require('jquery'),
    AbstractDOMView   = require('abstract/view/DOM/DOMView'),
    MenuView          = require('page/main/views/menuView'),
    EVENT             = require('event/event'),
    Backbone          = require('backbone');



/**
 * MainView: Handles the main view logic - window/document event
 * @extend {abstract/view/DOM/DOMview}
 * @constructor
 */
var MainView = AbstractDOMView.extend(new function (){

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

  /**
   * Meta viewport element
   * @type {element}
   * @private
   */
  this.metaViewport = null;

});



/**
 * @override
 */
MainView.prototype.initDOM = function() {
  this.$el.addClass('init');
  this.metaViewport = document.querySelector('meta[name=viewport]');
}


/**
 * @override
 */
MainView.prototype.initSubViews = function() {
  this.menuView = new MenuView();
  this.menuView.init();

  // Destroy assets references
  this.params.assets.length = 0;
  this.params.assets = {};
}


/**
 * @override
 * Bind all the main window/document event here.
 */
MainView.prototype.bindEvents = function() {

  window.addEventListener("resize",  $.proxy(_onResize, this), false);
  window.requestAnimationFrame(_onRAF.bind(this));
  
  if("onorientationchange" in window) {
    window.addEventListener("orientationchange", $.proxy(_onOrientationChange, this), false);
  }

  document.addEventListener("mouseout",  $.proxy(_onMouseOut, this), false);

  this.listenTo(this.menuView, EVENT.TOGGLE_MENU, $.proxy(_toggleMenu, this));
  this.canUpdate = true;
}


/**
 * @override
 */
MainView.prototype.show = function() {
  this.menuView.show();
  AbstractDOMView.prototype.show.call(this);
}


/**
 * @override
 */
MainView.prototype.onResize = function() {
  this.menuView.resize(this.viewport);
}


/**
 * @override
 */
MainView.prototype.onOrientationChange = function() {

  var scale = 1;

  if (this.viewport.width < this.refWidth) {
    scale = this.viewport.width / this.refWidth;
  }

  this.metaViewport.content = "width=device-width, initial-scale="+scale+", maximum-scale="+scale+", user-scalable=yes";
}


/**
 * Public interface on toggle menu
 */
MainView.prototype.toggleMenu = function() {
  _toggleMenu.call(this);
}

/* 
 * @override
 * Do nothing here.
 */
MainView.prototype.dispose = function() {}


/**
 * On menu toggled
 */
var _toggleMenu = function() {
  this.$el.toggleClass('nav-shown');
}


/**
 * On Orientation change
 */
var _onOrientationChange = function() {
  this.orientationChange();
  this.trigger(EVENT.ON_ORIENTATION_CHANGE, {viewport: this.viewport});
}


/**
 * On Resize
 */
var _onResize = function(e) { 
  this.resize();
  this.trigger(EVENT.ON_RESIZE, {viewport: this.viewport});
}


/**
 * On request animation frame
 */
var _onRAF = function() {
  this.update();
  this.trigger(EVENT.ON_RAF);

  window.requestAnimationFrame(_onRAF.bind(this));
}


/**
 * On Mouse out
 */
var _onMouseOut = function(e) {
  var from = e.relatedTarget || e.toElement;

  var outWindow = false;
  if (!from || from.nodeName == "HTML") outWindow = true;

  this.onMouseOut(outWindow);
  this.trigger(EVENT.ON_MOUSE_OUT, {outWindow: outWindow});
}


module.exports = MainView;