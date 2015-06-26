'use strict';


var EVENT     = require('event/event');

/**
 * View: Defines a view with basic methods
 * @extend {Backbone.View}
 * @constructor
 */
var View = function (){

  /**
   * Object as associative array of all the <Timeline> objects
   * @type {Object}
   */
  this.TL = {};

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

};


/**
 * Init the view. 
 *  Usefull when we have to wait for computer procesing, like canvas initialization for instance.
 */
View.prototype.init = function() {
  
  if (this.isInit) return;
  
  this.bindEvents();

  if (this.canTriggerInit)
    this.onInit();
}

View.prototype.onInit = function() {
  this.isInit = true;
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
 * Called on mouseOut
 */
View.prototype.onMouseOut = function() {
  
}


/**
 * Called on mouseMove
 */
View.prototype.onMouseMove = function() {

}


/**
 * Called on mouseDown
 */
View.prototype.onMouseDown = function() {

}


/**
 * Called on mouseDown
 */
View.prototype.onMouseUp = function() {

}


/**
 * Callback on request Animation frame if the view can be updated (this.canUpdate)
 */
View.prototype.onScroll = function() {

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
  this.canUpdate = true;
  this.isShown = true;
  this.trigger(EVENT.SHOWN);
}


/**
 * Hide the view
 */
View.prototype.hide = function() {
  this.onHidden();
}

/**
 * PreHide the view
 */
View.prototype.preHide = function() {
  this.onPreHidden();
}

View.prototype.onPreHidden = function() {
  this.trigger(EVENT.PRE_HIDDEN);
}


View.prototype.directHide = function() {
  this.onHidden();
}

View.prototype.onHidden = function() {
  this.isShown = false;
  this.trigger(EVENT.HIDDEN);
}


/**
 * Post hide the view
 */
View.prototype.postHide = function() {
  this.onPostHidden();
}

View.prototype.onPostHidden = function() {
  this.trigger(EVENT.POST_HIDDEN);
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
  this.remove();

  this.$el = null;
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