'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery'),
    Interaction   = require('abstract/interaction'),
    _             = require('underscore'),
    Backbone      = require('backbone');

  var StartInteraction = function(options) {

    this.conf = options || "";
    this.down = false;
    this.mousePosition = {};

    this.clickCoords={
      x:0,
      y:0
    }
    this.direction;
    this.deltaClick = 2;
    
    this.circleArray = [];
    this.circleLength = 2;

    this.state = 0;
    this.animating = false;

    this.Const = {
      'TYPE': 'slide',
      'WIDTH': 1024,
      'HEIGHT': 768
    }
    this.maxSpeed = 200;

    this.frames = [];
    this.framesLength = 26;
    this.framesIndex = 0;

    this.fps = 30;
    this.now;
    this.then = Date.now();
    this.interval = 1000/this.fps;
    this.delta;

    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  StartInteraction.prototype = Object.create(Interaction.prototype);
  StartInteraction.prototype.constructor = StartInteraction;
  
  StartInteraction.prototype.init = function() {

    Interaction.prototype.init.call(this);
    this.interactive = true;
    
  }

  StartInteraction.prototype.bindEvents = function(data) {
    this.cursor.mousedown = this.touchstart = $.proxy(this.mouseDownHandler, this);
    this.mousemove = this.touchmove = $.proxy(this.mouseMoveHandler, this);
    this.mouseup   = this.touchend =  $.proxy(this.mouseUpHandler, this);
    }

  StartInteraction.prototype.obJmouseMoveHandler = function(data){
   
  }

  StartInteraction.prototype.mouseDownHandler = function(data) {

    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;
    this.down = true;
  };
  
  StartInteraction.prototype.mouseMoveHandler = function(data) {
    
    this.mouseSpeedX = data.getLocalPosition(this.stage).x;

    if(this.down){
      // if(data.getLocalPosition(this).x > this.mousePosition.x) this.direction = "right";
      // else this.direction = "left";
      if(data.getLocalPosition(this.UIContainer).x>0 && data.getLocalPosition(this.UIContainer).x<220) this.cursor.position.x = data.getLocalPosition(this.UIContainer).x;

      this.framesIndex = Math.round(data.getLocalPosition(this.UIContainer).x/220 * this.framesLength);

      if(this.framesIndex<0)this.framesIndex=0;
      if(this.framesIndex>=this.framesLength)this.framesIndex=this.framesLength-1;

      if(this.oldFrame) this.oldFrame.alpha=0;
      this.currentFrame = this.frames[this.framesIndex];
      this.currentFrame.alpha=1;
      this.oldFrame=this.currentFrame;

      this.mousePosition.x=data.getLocalPosition(this).x;
      this.mousePosition.y=data.getLocalPosition(this).y;
    }

  };  

  StartInteraction.prototype.mouseUpHandler = function(data) {
    this.down = false;

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }

  };

  StartInteraction.prototype.clickMenuHandler = function(data) {
    if(this.animating) return;
    this.animating =true;

  }

  StartInteraction.prototype.render = function() {

    this.bagImageContainer = new PIXI.DisplayObjectContainer();

    this.background = new PIXI.Graphics();
    this.background.beginFill(0x0e1118);
    this.background.drawRect(0,0,this.viewport.width,this.viewport.height);
    this.addChild(this.background);

    for (var i=1; i<=this.framesLength; i++){
        var frame = new PIXI.Sprite(PIXI.TextureCache['start_interaction_start'+i]);
        frame.width = PIXI.TextureCache['start_interaction_start'+i].width;
        frame.height = PIXI.TextureCache['start_interaction_start'+i].height;
        frame.scale.x = 1;
        frame.scale.y = 1;
        frame.anchor.x = .5;
        frame.anchor.y = .5;
        frame.position.x = frame.width/2;
        frame.position.y = frame.height/2;
        if(i!=1) frame.alpha = 0;
        frame.cacheAsBitmap = true;
        this.frames.push(frame);
        this.bagImageContainer.addChild(frame);
    }

    this.addChild(this.bagImageContainer);

    this.UIContainer = new PIXI.DisplayObjectContainer();

    var line01 = new PIXI.Graphics();
    line01.beginFill(0x818081);
    // draw a rectangle
    line01.drawRect(0, 0, 2, 8);
    
    var line02 = new PIXI.Graphics();
    line02.beginFill(0x818081);
    // draw a rectangle
    line02.drawRect(220, 0, 2, 8);

    var line03 = new PIXI.Graphics();
    line03.beginFill(0x818081);
    // draw a rectangle
    line03.drawRect(0, 3, 220, 2);

    this.cursor = new PIXI.Sprite(PIXI.TextureCache['start_interaction_cursor']);
    this.cursor.width = PIXI.TextureCache['start_interaction_cursor'].width;
    this.cursor.height = PIXI.TextureCache['start_interaction_cursor'].height;
    this.cursor.scale.x = 1;
    this.cursor.scale.y = 1;
    this.cursor.anchor.x = .5;
    this.cursor.anchor.y = .5;
    this.cursor.position.y = 4;
    this.cursor.position.x = 110;
    this.cursor.interactive = true;

    this.UIContainer.addChild(line01);
    this.UIContainer.addChild(line02);
    this.UIContainer.addChild(line03);
    this.UIContainer.addChild(this.cursor);

    var title = new PIXI.Text("DRAG TO TURN THE BAG", { font: "500 14px Montserrat", fill: "#ffffff", align: "center"});
    title.position.x = 110;
    title.position.y = 30;
    title.anchor.x = 0.5; 
    this.UIContainer.addChild(title);

    this.addChild(this.UIContainer);

    this.canUpdate = false;

    this.onResize();
    this.bindEvents();
    //this.displayIntroduction();
  
  }

  StartInteraction.prototype.onUpdate = function() {

    this.now = Date.now();
    this.delta = this.now - this.then;
     

    if(this.down){
      this.fps = 60;
      this.speedX = this.mouseSpeedX - this.prevMouseX;
      this.speedX > 0 ? this.direction = "right" : this.direction = "left";
      this.speedX = Math.abs(Math.round(Math.max(Math.min(this.speedX , this.maxSpeed), -this.maxSpeed)));
    }


    // this.speedX *= 0.9;

    // if (Math.abs(this.speedX) <= 0.01) this.speedX = 0;

    this.prevMouseX = this.mouseSpeedX;

    if (this.delta > this.interval && this.speedX>1) {
        // update time stuffs
        this.then = this.now - (this.delta % this.interval);

        if(this.oldFrame) this.oldFrame.alpha=0;
        this.currentFrame = this.frames[this.framesIndex];
        this.currentFrame.alpha=1;
        this.oldFrame=this.currentFrame;

        this.direction === "right" ? this.framesIndex++ : this.framesIndex--;
        if(this.framesIndex>=this.framesLength) this.framesIndex=0;
        if(this.framesIndex<0) this.framesIndex = this.framesLength-1;
        
    }

    
  }


  StartInteraction.prototype.onResize = function() {

    //var dimensions = Tools.fitImage(this.Const.WIDTH, this.Const.HEIGHT, this.viewport.width, this.viewport.height);
    if(this.UIContainer) this.UIContainer.position.x = (this.viewport.width/2) -110;
    if(this.UIContainer) this.UIContainer.position.y = this.viewport.height*.8;

    if(this.bakground) this.background.clear();
    if(this.bakground) this.background.beginFill(0x0e1118);
    if(this.bakground) this.background.drawRect ( 0,0,this.viewport.width,this.viewport.height);

    for (var i=0; i<this.frames.length; i++){

      var currentFrame = this.frames[i];
      currentFrame.position.x = this.viewport.width/2;
      currentFrame.position.y = this.viewport.height/2;

    }
  } 

  StartInteraction.prototype.hide = function() {
    _hide.call(this);
  }

  StartInteraction.prototype.dispose = function() {

    this.canUpdate = false;    

  }
  var _hide = function() {
    this.canUpdate = false;
    TweenLite.to(this, .7, {  alpha:0, ease: Cubic.easeOut, onComplete:$.proxy(_onHidden, this) });
  }

  var _onHidden = function() {
    this.removeChildren();
    Interaction.prototype.hide.call(this);
  }


module.exports = StartInteraction;
