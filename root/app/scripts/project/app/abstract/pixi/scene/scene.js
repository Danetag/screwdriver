'use strict';

var   AbstractView  = require('abstract/pixi/view'),
      Config        = require('config/config'),
      EVENT         = require('event/event');

/**
 * View: Defines a view with basic methods
 * @extend {PIXI.DisplayObjectContainer}
 * @constructor
 */
var Scene = function (options_){

  //PIXI.DisplayObjectContainer.call(this);
  this.id = (this.id != undefined) ? this.id : "canvas-pixy";

  this.stage = null;

  this.renderer = null;

  this.rendererOptions = {
    antialias:true,
    transparent:true,
    resolution:1
  }

  AbstractView.call(this, options_);

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


  //if( Detectizr.browser.name == 'ie' && Detectizr.browser.version <= 10 ){
    // force a simple canvas renderer.
    // this doesn't help
   // this.renderer = PIXI.autoDetectRenderer($(document).width(), $(window).height(), this.rendererOptions);
    //return false;
 // }else{
  //  // create a renderer instance.
    this.renderer = PIXI.autoDetectRenderer($(document).width(), $(window).height(), this.rendererOptions);
  //}

  //console.log(" ----- renderer " , this.renderer );

  this.renderer.view.id = this.id;

  this.stage = new PIXI.Container();
  //this.stage.interactive = true;

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
    //console.log('scene resize', this.viewport.width, Config.mainView.viewport.width, "$(document).width()", $(document).width() , "$(window).width()", $(window).width(), 'document.body.clientWidth', document.body.clientWidth) ;
    this.renderer.resize(this.viewport.width, this.viewport.height);
  }
    

}

/**
 * @override
 */
Scene.prototype.dispose = function() {
  this.canUpdate = false;

  //this.stage.removeStageReference();
  this.stage = null;
  this.renderer = null;

  AbstractView.prototype.dispose.call(this)
}




module.exports = Scene;