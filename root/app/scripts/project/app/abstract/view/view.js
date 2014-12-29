'use strict';

var $         = require('jquery'),
    EVENT     = require('event/event'),
    _         = require('underscore'),
    Backbone  = require('backbone');



/**
 * View: Defines a view with basic methods
 * @extend {Backbone.View}
 * @constructor
 */
var View = Backbone.View.extend(new function (){

  /**
   * Object as associative array of all the <Timeline> objects
   * @type {Object}
   */
  this.TL = {};

  /**
   * Viewport object
   * @type {Object}
   */
  this.viewport = {};

  /**
   * Can update the current view on request animation frame?
   * @type {boolean}
   */
  this.canUpdate = false;

});



/**
 * Init the view. 
 *  Usefull when we have to wait for computer procesing, like canvas initialization for instance.
 */
View.prototype.init = function() {
  this.bindEvents();
  this.trigger(EVENT.INIT);
}


/**
 * Bind events
 */
View.prototype.bindEvents = function() {

}


/**
 * Unbind events
 */
View.prototype.unbindEvents = function() {

}


/**
 * Called on request animation frame
 */
View.prototype.update = function() {
  if (this.canUpdate) this.onUpdate();
}


/**
 * Called on resize
 * @param {object} viewport contains width/height of the browser
 */
View.prototype.resize = function(viewport) {
  this.viewport = (viewport != undefined) ? viewport : { width: $(window).width, height:$(window).height };

  this.onResize();
}


/**
 * Called on orientationChange
 * @param {object} viewport contains width/height of the browser
 */
View.prototype.orientationChange = function(viewport) {
  this.viewport = (viewport != undefined) ? viewport : { width: $(window).width, height:$(window).height };

  this.onOrientationChange();
}


/**
 * Called on mouseOut
 * @param {boolean} outWindow is out of the window?
 */
View.prototype.onMouseOut = function(outWindow) {
  
}


/**
 * Callback on request Animation frame if the view can be updated (this.canUpdate)
 */
View.prototype.onUpdate = function() {

}


/**
 * Callback on resize, this.viewport is updated.
 */
View.prototype.onOrientationChange = function() {

}


/**
 * Callback on resize, this.viewport is updated.
 */
View.prototype.onResize = function() {

}


/**
 * Show the view
 */
View.prototype.show = function() {
  this.canUpdate = true;
  this.trigger(EVENT.SHOWN);
}


/**
 * Hide the view
 */
View.prototype.hide = function() {
  this.canUpdate = false;
  this.trigger(EVENT.HIDDEN);
}


/**
 * Dispose the view
 */
View.prototype.dispose = function() {
  this.unbindEvents();
  this.destroyTL();
  this.remove();
}


/**
 * Kill a timeline
 * @param {string} name of the timeline stocked in this.TL.
 */
View.prototype.killTL = function(name) {

  if( this.TL[name] == undefined || this.TL[name] == null )
    return;

  var tl = this.TL[name];

  tl.stop();
  tl.kill();
  tl.clear();
  tl = null;

}


/**
 * Kill all the timelines
 */
View.prototype.destroyTL = function() {

  for(var name in this.TL ) {
    this.killTL(name);
  };

  this.TL = {};
}


module.exports = View;