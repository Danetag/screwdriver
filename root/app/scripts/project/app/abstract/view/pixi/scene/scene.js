'use strict';

var   AbstractView  = require('abstract/view/view'),
      Config        = require('config/config'),
      EVENT         = require('event/event');

/**
 * View: Defines a view with basic methods
 * @extend {PIXI.DisplayObjectContainer}
 * @constructor
 */
var Scene = function (options_){

  this.id = (this.id != undefined) ? this.id : "canvas-pixy";

  this.stage = null;

  this.renderer = null;

  this.rendererOptions = {
    antialias:true,
    transparent:true,
    resolution:1
  }

  AbstractView.call(this);

};

_.extend(Scene, AbstractView);
_.extend(Scene.prototype, AbstractView.prototype);


/**
 * Init the view. 
 *  Usefull when we have to wait for computer procesing, like canvas initialization for instance.
 */
Scene.prototype.init = function() {
  this.initScene();
  AbstractView.prototype.init.call(this);
}


Scene.prototype.initScene = function() {

  this.renderer = PIXI.autoDetectRenderer($(document).width(), $(window).height(), this.rendererOptions);

  this.renderer.view.id = this.id;

  this.stage = new PIXI.Container();

  this.options.$container.append(this.renderer.view);

}

/**
 * Called on request animation frame
 */
Scene.prototype.onUpdate = function() {

  if (this.renderer != null && this.stage != null){
    this.renderer.render(this.stage);
  }  

}


/**
 * Called on resize
 * @param {object} viewport contains width/height of the browser
 */
Scene.prototype.onResize = function() {

  if (this.renderer != null) {
    this.renderer.resize();
  }
    

}

/**
 * @override
 */
Scene.prototype.dispose = function() {
  this.canUpdate = false;
  
  this.stage = null;
  this.renderer = null;

  AbstractView.prototype.dispose.call(this)
}




module.exports = Scene;