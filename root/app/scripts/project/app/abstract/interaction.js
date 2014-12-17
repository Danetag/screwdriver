'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery');


  var Interaction = function(options) {

    PIXI.DisplayObjectContainer.call(this);

   /*
    * Object as associative array of all the <Timeline> objects
    * @type {View}
    */
    this.TL = {};

   /*
    * Alpha for the current slide bg
    * @type {number}
    */
    this.alphaBG = 0.5;

    /*
     * Viewport object
     * @type {Object}
     */
    this.viewport = {};

    /*
     * Points objecy
     * @type {Object}
     */
    this.points = {};

    /*
     * Can update
     * @type {boolean}
     */
    this.canUpdate = false;

    /*
     * Is the current interaction is done?
     * @type {boolean}
     */
    this.isInteractionDone = false;

  }
  
  Interaction.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  Interaction.prototype.constructor = Interaction;

  Interaction.prototype.init = function() {
    console.log(this);
    this.resize();
    this.render();
    this.bindEvents();

    // Stack
    setTimeout($.proxy(function(){
      this.trigger(EVENT.INIT);
    }, this), 0)
    
  }


  Interaction.prototype.render = function() {
  }

  Interaction.prototype.bindEvents = function() {
  }

  Interaction.prototype.unbindEvents = function() {

  }

  Interaction.prototype.onUpdate = function() {
    if (this.canUpdate) this.onUpdate();
  }

  Interaction.prototype.resize = function(viewport) {
    this.viewport = (viewport != undefined) ? viewport : { width: $(window).width(), height:$(window).height() };
    this.onResize();
  }

  Interaction.prototype.onMouseOut = function(outWindow) {
    
  }

  Interaction.prototype.onResize = function() {
    console.log("onResize");
  }

  Interaction.prototype.setInteractive = function(interactive) {
    this.canUpdate = interactive;
    this.interactive = interactive;
  }

  Interaction.prototype.toggleInteractive = function() {
    this.canUpdate = !this.canUpdate;
    this.interactive = !this.interactive;
    this.visible = !this.visible;
  }

  Interaction.prototype.show = function() {
    this.trigger(EVENT.SHOWN);
  }

  Interaction.prototype.hide = function(direct) {

    if(!direct) this.trigger(EVENT.INTERACTION_DONE);
    this.trigger(EVENT.HIDDEN);

  }

  Interaction.prototype.dispose = function() {
    this.unbindEvents();
    this.destroyTL();
  }

  Interaction.prototype.killTL = function(name) {

    if( this.TL[name] == undefined || this.TL[name] == null )
      return;

    var tl = this.TL[name];

    tl.stop();
    tl.kill();
    tl.clear();
    tl = null;

  }

  Interaction.prototype.destroyTL = function() {

    for(var name in this.TL ) {
      this.killTL(name);
    };

    this.TL = {};
  }



module.exports = Interaction;
