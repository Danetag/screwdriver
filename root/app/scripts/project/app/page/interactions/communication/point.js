var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    _             = require('underscore'),
    Backbone      = require('backbone'),
    $             = require('jquery');

var Point = function(options) {

    PIXI.DisplayObjectContainer.call(this);

    _.extend(this, Backbone.Events);

  	// this.id = options ? options.id : "" ;
   //  this.url = options ? options.url : "" ;
   //  this.index = options ? options.index : "" ;
   //  this.coverAsset = options ? options.assets.cover : null ;
   //  this.coverBlurAsset = options ? options.assets.cover_blur : null ;
    this.id = options ? options.id : null ;
  
    this.conf = options;   

    /* Coords object for click detection */
    this.clickCoords = {};
    this.deltaClick = Tools.isTablet() ? 10 : 2;

    /* Shown/Hidden callback functions */
    this.shownCallback = null;
    this.hiddenCallback = null;

    this.viewport = {};
    this.initState = true;

    /* Sprite */
    this.circle = null;
    this.circleContour   = null;

    this.connections = [];
    this.connected = false;

  }

  Point.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  Point.prototype.constructor = Point;

  Point.prototype.bindEvents = function() {
    this.circle.mousedown = this.circle.touchstart = $.proxy(this.circleMouseDownHandler, this);
    this.circle.mouseup   = this.circle.touchend =  $.proxy(this.circleMouseUpHandler, this);
  }

  Point.prototype.circleMouseDownHandler = function(data){

    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;

    this.trigger(EVENT.CLICK_POINT, {point:this});
  }

  Point.prototype.circleMouseUpHandler = function(data){

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }
  }

  Point.prototype.clickMenuHandler = function(data){

  }

  Point.prototype.render = function(){

    if(this.conf.intro){
      this.position.x = this.conf.intro_position.x * this.viewport.width;
      this.position.y = this.conf.intro_position.y * this.viewport.height;
    }else{
      this.position.x = this.conf.position.x * this.viewport.width;
      this.position.y = this.conf.position.y * this.viewport.height;
    }

    // create a new Sprite using the texture
    this.circle = new PIXI.Sprite(PIXI.TextureCache['communication_interaction_circle']);
    this.circle.width = PIXI.TextureCache['communication_interaction_circle'].width;
    this.circle.height = PIXI.TextureCache['communication_interaction_circle'].height;
    this.circle.scale.x = 0;
    this.circle.scale.y = 0;
    this.circle.anchor.x = .5;
    this.circle.anchor.y = .5;
    this.circle.position.x = 0;
    this.circle.position.y = 0;
    this.circle.alpha = 1;
    this.circle.cacheAsBitmap = true;
    this.circle.interactive = true;
    this.circle.buttonMode = true;

    this.circleContour = new PIXI.Sprite(PIXI.TextureCache['communication_interaction_circle_contour']);
    this.circleContour.width = PIXI.TextureCache['communication_interaction_circle_contour'].width;
    this.circleContour.height = PIXI.TextureCache['communication_interaction_circle_contour'].height;
    this.circleContour.scale.x = 0;
    this.circleContour.scale.y = 0;
    this.circleContour.anchor.x = .5;
    this.circleContour.anchor.y = .5;
    this.circleContour.position.x = 0;
    this.circleContour.position.y = 0;
    this.circleContour.alpha = 1;
    this.circleContour.cacheAsBitmap = true;

    this.addChild(this.circle);
    this.addChild(this.circleContour);

    this.bindEvents();

  }

  Point.prototype.show = function() {
    var scale = 1 ;
    TweenMax.set(this.circle.scale,{x:0,y:0});
    TweenMax.to(this.circle.scale,.5,{x:scale,y:scale});
  }

  Point.prototype.hide = function() {
    this.toggleCircle(false);
  }

  Point.prototype.updatePosition = function() {

    TweenMax.to(this.position,.5,{x:this.conf.position.x * this.viewport.width,y:this.conf.position.y * this.viewport.height});

  };

  Point.prototype.update = function() {
  	
  };


  Point.prototype.triggerSignal = function(){
      
    TweenMax.set(this.circleContour.scale,{x:0,y:0});
    TweenMax.set(this.circleContour,{alpha : 1 });
    TweenMax.to(this.circleContour.scale,.5,{x:2,y:2});
    TweenMax.to(this.circleContour,.5,{alpha : 0});
  
  };

  Point.prototype.toggleCircle = function(state){

    // var scale  = state ? 1 : .5;
    // var alpha  = state ? 1 : 0;
    // var easing = state ? Back.easeOut : Back.easeIn;
    // var onComplete = state ? this.shownCallback : this.hiddenCallback;

    // this.hasBeenShownOnce = true;

    // //console.log('onComplete', onComplete);

    // //hide circle
    // TweenMax.to(this.handSprite.scale,.5,{x:scale,y:scale,ease : easing ,delay: state ? .2 : 0});
    // TweenMax.to(this.handSprite,.5,{alpha : alpha ,delay: state ? .2 : 0});
    // TweenMax.to(this.circleSprite.scale,.5,{x:scale,y:scale,ease : easing ,delay: state ? 0 : .2});
    // TweenMax.to(this.circleSprite,.5,{alpha : alpha, onComplete: onComplete, onCompleteParams:[{sprite:this}], delay: state ? 0 : .2});
  }

  Point.prototype.resize = function(viewport){
    this.viewport.width=viewport.width;
    this.viewport.height=viewport.height;

    if(this.initState===true && this.conf.intro){
      this.position.x = this.conf.intro_position.x * this.viewport.width;
      this.position.y = this.conf.intro_position.y * this.viewport.height;
    }else{
      this.position.x = this.conf.position.x * this.viewport.width;
      this.position.y = this.conf.position.y * this.viewport.height;
    }

  };

module.exports = Point;