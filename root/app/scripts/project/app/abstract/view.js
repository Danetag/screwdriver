'use strict';

var $         = require('jquery'),
    EVENT     = require('event/event'),
    Backbone  = require('backbone');

var AbstractView = Backbone.View.extend(new function (){

  /*
   * Object as associative array of all the <Timeline> objects
   * @type {View}
   */
  this.TL = {};

  /*
   * Viewport object
   * @type {Object}
   */
  this.viewport = {};

  /*
   * Can update the current view ?
   * @type {boolean}
   */
  this.canUpdate = false;

  this.initialize = function(options) {
    this.options = options;
    this.render();
  }

  // (We could have to wait for processing, like canvas initialization for instance)
  this.init = function() {
    this.bindEvents();
    this.trigger(EVENT.INIT);
  }

  this.render = function() {

  }

  this.bindEvents = function() {

  }

  this.unbindEvents = function() {

  }

  this.update = function() {
    if (this.canUpdate) this.onUpdate();
  }

  this.resize = function(viewport) {
    this.viewport = (viewport != undefined) ? viewport : { width: $(window).width, height:$(window).height };

    this.onResize();
  }

  this.onUpdate = function() {

  }

  this.onMouseOut = function(outWindow) {
    
  }

  this.orientationChange = function(viewport) {
    this.viewport = (viewport != undefined) ? viewport : { width: $(window).width, height:$(window).height };

    this.onOrientationChange();
  }

  this.onOrientationChange = function() {

  }

  this.onResize = function() {

  }

  this.show = function() {
    this.trigger(EVENT.SHOWN);
  }

  this.hide = function() {
    this.trigger(EVENT.HIDDEN);
  }

  this.dispose = function() {
    this.unbindEvents();
    this.destroyTL();
    this.remove();
  }

  this.killTL = function(name) {

    if( this.TL[name] == undefined || this.TL[name] == null )
      return;

    var tl = this.TL[name];

    tl.stop();
    tl.kill();
    tl.clear();
    tl = null;

  }

  this.destroyTL = function() {

    for(var name in this.TL ) {
      this.killTL(name);
    };

    this.TL = {};
  }

});


module.exports = AbstractView;