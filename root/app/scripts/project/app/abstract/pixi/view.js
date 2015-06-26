'use strict';

// var $         = require('zepto-browserify').$,
     
//     Backbone  = require('backbone'),
var EVENT     = require('event/event');



/**
 * View: Defines a view with basic methods
 * @extend {PIXI.DisplayObjectContainer}
 * @constructor
 */
var View = function (options_){

  this.options = options_;

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
  this.canUpdate = (this.canUpdate != undefined) ? this.canUpdate : false;

  /**
   * Has been init?
   * @type {boolean}
   */
  this.isInit = (this.isInit != undefined) ? this.isInit : false;

  /**
   * Has been shown?
   * @type {boolean}
   */
  this.isShown = (this.isShown != undefined) ? this.isShown : false;

  /**
   * Has been init?
   * @type {boolean}
   */
  this.canTriggerInit = (this.canTriggerInit != undefined) ? this.canTriggerInit : true;

  _.extend(this, Backbone.Events);

};



/**
 * Init the view. 
 *  Usefull when we have to wait for computer procesing, like canvas initialization for instance.
 */
View.prototype.init = function() {

  if (this.isInit) {
    this.onInit();
    return;
  }

  this.render();
  this.bindEvents();
  this.resize();

  if (this.canTriggerInit)
    this.onInit();
}


View.prototype.onInit = function() {

  this.isInit = true;
  this.canUpdate = true;

  this.trigger(EVENT.INIT);
}



View.prototype.render = function() {
  
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
  if (this.canUpdate)
    this.onUpdate();
}


/**
 * Called on resize
 * @param {object} viewport contains width/height of the browser
 */
View.prototype.resize = function(viewport) {
  this.viewport = (viewport != undefined) ? viewport : { width: $(document).width(), height:$(window).height() };

  this.onResize();
}


/**
 * Called on orientationChange
 * @param {object} viewport contains width/height of the browser
 */
View.prototype.orientationChange = function(viewport) {
  this.viewport = (viewport != undefined) ? viewport : { width: $(document).width(), height:$(window).height() };

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
  this.onShown();
}

View.prototype.directShow = function() {
  this.onShown();
}

View.prototype.onShown = function() {
  this.isShown = true;
  this.trigger(EVENT.SHOWN);
}


/**
 * Hide the view
 */
View.prototype.hide = function() {
  this.onHidden();
}

View.prototype.directHide = function() {
  this.onHidden();
}

View.prototype.onHidden = function() {
  
  this.isShown = false;
  this.trigger(EVENT.HIDDEN);
}



/**
 * Dispose the view
 */
View.prototype.dispose = function() {
  
  this.isInit = false;
  this.isShown = false;
  this.canUpdate = false;

  this.unbindEvents();
  this.destroyTL();
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

  this.TL[name] = null;

  //console.log('View.prototype.killTL:after', name, this.TL[name]);

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