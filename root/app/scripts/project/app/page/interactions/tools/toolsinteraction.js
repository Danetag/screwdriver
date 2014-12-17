'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery'),
    Interaction   = require('abstract/interaction'),
    _             = require('underscore'),
    Backbone      = require('backbone');

  var ToolsInteraction = function(options) {

    this.conf = options || "";
    this.down = false;
    this.mousePosition = {};

    this.clickCoords={
      x:0,
      y:0
    }
    this.deltaClick = 2;
    
    this.sliceArray = [];
    this.sliceLength = 6;

    this.state = 0;
    this.animating = false;

    this.Const = {
      'TYPE': 'slide',
      'WIDTH': 1024,
      'HEIGHT': 768
    }

    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  ToolsInteraction.prototype = Object.create(Interaction.prototype);
  ToolsInteraction.prototype.constructor = ToolsInteraction;
  
  ToolsInteraction.prototype.init = function() {

    Interaction.prototype.init.call(this);
    this.interactive = true;

  }

  ToolsInteraction.prototype.bindEvents = function(data) {
    this.mousedown = this.touchstart = $.proxy(this.mouseDownHandler, this);
    this.mousemove = this.touchmove = $.proxy(this.mouseMoveHandler, this);
    this.mouseup   = this.touchend =  $.proxy(this.mouseUpHandler, this);
    this.sliceContainer.click   = this.sliceContainer.tap = $.proxy(this.breakWall, this);
    }

  ToolsInteraction.prototype.obJmouseMoveHandler = function(data){
   
  }

  ToolsInteraction.prototype.mouseDownHandler = function(data) {
    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;
    this.down = true;
  };
  
  ToolsInteraction.prototype.mouseMoveHandler = function(data) {
    
    if(this.down){
      this.mousePosition.x=data.getLocalPosition(this).x;
      this.mousePosition.y=data.getLocalPosition(this).y;
    }

  };  

  ToolsInteraction.prototype.mouseUpHandler = function(data) {
    this.down = false;

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }
  };

  ToolsInteraction.prototype.clickMenuHandler = function(data) {

  }

  ToolsInteraction.prototype.breakWall = function(data) {
    // TweenMax.set(this.fissureMask.position,{x:-this.fissure.width});
    // TweenMax.to(this.fissureMask.position,.5,{x:0});

    // TweenMax.set(this.fissureMask1.position,{y:-this.fissure1.height});
    // TweenMax.to(this.fissureMask1.position,.5,{y:0,delay:.5});

    if(this.animating) return;

    this.animating = true; 

    var tl = new TimelineMax({onReverseComplete:function(){
      this.animating = false;
    }.bind(this)});

    var tweenArray = [];

    for (var i=0; i<this.sliceLength; i++){

      var currentSlice = this.sliceArray[i];
      var t1 = TweenMax.to(currentSlice.position,2,{y:2000,delay:.3+(.1*i)});
      var t2 = TweenMax.to(currentSlice.scale,1,{x:0.8 ,y:0.8,delay:(.1*i)});

      var max = 10;
      var min = -10;
      var currentRotation = (Math.random() * (max - min) + min);

      var t3 = TweenMax.to(currentSlice,1,{rotation:currentRotation* (Math.PI/180) , delay:(.1*i)});

      switch (this.state) {
      case 0:
        this.coverSprite.alpha = 1;
        this.shakeTween(currentSlice.position, 10, 1);
        break;
      case 1:
        this.shakeTween(currentSlice.position, 15, 5);
        break;
      }

      tweenArray.push(t1,t2,t3);
      
    }

    tl.add(tweenArray,"+=0","normal");

    tl.pause();

    if(this.state===2){

      this.coverSprite.alpha = 0;

      tl.play();

      _.delay(function(){
        tl.reverse();
        _.delay(function(){
          this.trigger(EVENT.INTERACTION_DONE);
        }.bind(this), 800);

      }.bind(this), 2200);

    }
    //Set the next step
    this.state+=1;
    if(this.state===3) this.state=0;

  }

  ToolsInteraction.prototype.render = function() {
    this.canUpdate = false;

    this.sliceContainer = new PIXI.DisplayObjectContainer();
    this.sliceContainer.pivot.x = .5;
    this.sliceContainer.pivot.y = .5;
    this.sliceContainer.interactive = true;

    this.coverSprite = new PIXI.Sprite(PIXI.TextureCache["tools_cover"]);
    this.coverSprite.cacheAsBitmap = true;
    this.sliceContainer.addChild(this.coverSprite);

    for (var i=1; i<=this.sliceLength; i++){
        var slice = new PIXI.Sprite(PIXI.TextureCache['tools_interaction_slice0'+i]);
        slice.width = PIXI.TextureCache['tools_interaction_slice0'+i].width;
        slice.height = PIXI.TextureCache['tools_interaction_slice0'+i].height;
        slice.scale.x = 1;
        slice.scale.y = 1;
        slice.anchor.x = .5;
        slice.anchor.y = .5;
        slice.position.x = slice.width/2;
        slice.position.y = slice.height/2;
        slice.alpha = 1;
        slice.cacheAsBitmap = true;
        this.sliceArray.push(slice);
        this.sliceContainer.addChild(slice);
    }

    this.fissureContainer = new PIXI.DisplayObjectContainer();
    this.fissureContainer.position.x = 0;
    this.fissureContainer.position.y = 540;
    this.fissureContainer.rotation = 14 * (Math.PI/180);
    this.fissureContainer.width = PIXI.TextureCache['tools_interaction_fissure01'].width;
    this.fissureContainer.height = PIXI.TextureCache['tools_interaction_fissure01'].height;

    this.fissure = new PIXI.Sprite(PIXI.TextureCache['tools_interaction_fissure01']); 
    this.fissure.width = PIXI.TextureCache['tools_interaction_fissure01'].width;
    this.fissure.height = PIXI.TextureCache['tools_interaction_fissure01'].height;
    this.fissure.anchor.x = 0;
    this.fissure.anchor.y = 0;
    this.fissure.alpha = .6;
    this.fissure.cacheAsBitmap = true;

    this.fissureMask = new PIXI.Graphics();
    this.fissureMask.beginFill(0xFFFFFF);
    this.fissureMask.drawRect(0, 0,this.fissure.width,this.fissure.height);
    this.fissureMask.endFill();
    this.fissureMask.position.x=-this.fissure.width;
    
    this.fissure.mask = this.fissureMask;

    this.fissureContainer.addChild(this.fissure);
    this.fissureContainer.addChild(this.fissureMask);
  
    this.sliceContainer.addChild(this.fissureContainer);

    this.fissureContainer1 = new PIXI.DisplayObjectContainer();
    this.fissureContainer1.position.x = 345;
    this.fissureContainer1.position.y = 633;
    this.fissureContainer1.rotation = -20 * (Math.PI/180);
    this.fissureContainer1.width = PIXI.TextureCache['tools_interaction_fissure02'].width;
    this.fissureContainer1.height = PIXI.TextureCache['tools_interaction_fissure02'].height;

    this.fissure1 = new PIXI.Sprite(PIXI.TextureCache['tools_interaction_fissure02']); 
    this.fissure1.width = PIXI.TextureCache['tools_interaction_fissure02'].width;
    this.fissure1.height = PIXI.TextureCache['tools_interaction_fissure02'].height;
    this.fissure1.anchor.x = 0;
    this.fissure1.anchor.y = 0;
    this.fissure1.cacheAsBitmap = true;
    this.fissure1.alpha = .6;

    this.fissureMask1 = new PIXI.Graphics();
    this.fissureMask1.beginFill(0xFFFFFF);
    this.fissureMask1.drawRect(0, 0,this.fissure1.width,this.fissure1.height);
    this.fissureMask1.position.y = -this.fissure1.height;
    this.fissureMask1.endFill();
    
    this.fissure1.mask = this.fissureMask1;

    this.fissureContainer1.addChild(this.fissure1);
    this.fissureContainer1.addChild(this.fissureMask1);
  
    this.sliceContainer.addChild(this.fissureContainer1);

    this.addChild(this.sliceContainer);
    this.onResize();
    this.bindEvents();
    this.displayIntroduction();
  }

  ToolsInteraction.prototype.shakeTween = function(item,repeatCount,intensity){
    
    TweenMax.to(item,0.1,{repeat:repeatCount-1, y:item.y+(1+Math.random()*intensity), x:item.x+(1+Math.random()*intensity), delay:0.1, ease:Expo.easeInOut,onComplete:function(){
      this.animating=false;
    }.bind(this)});
    TweenMax.to(item,0.1,{y:item.y, x:item.x, delay:(repeatCount+1) * .1, ease:Expo.easeInOut});

  }

  ToolsInteraction.prototype.displayIntroduction = function() {
   

  }

  ToolsInteraction.prototype.renderBackground = function(){


  }

  ToolsInteraction.prototype.update = function() {


  }
  ToolsInteraction.prototype.onResize = function() {

    var dimensions = Tools.fitImage(this.Const.WIDTH, this.Const.HEIGHT, this.viewport.width, this.viewport.height);

    if(this.sliceContainer) this.sliceContainer.scale.x = dimensions.ratio;
    if(this.sliceContainer) this.sliceContainer.scale.y = dimensions.ratio;
    if(this.sliceContainer) this.sliceContainer.position.x = dimensions.left;
    if(this.sliceContainer) this.sliceContainer.position.y = dimensions.top;
  }

  ToolsInteraction.prototype.hide = function() {
    console.log("HIDE");
    _hide.call(this);
  }

  ToolsInteraction.prototype.dispose = function() {

    this.canUpdate = false;    

  }
  var _hide = function() {
    console.log("_HIDE");
    this.canUpdate = false;
    TweenLite.to(this.sliceContainer, .7, {  alpha:0, ease: Cubic.easeOut, onComplete:$.proxy(_onHidden, this) });
  }

  var _onHidden = function() {
    this.removeChildren();
    Interaction.prototype.hide.call(this);
  }

  var _checkConnectedPoints = function(pointsArray){

    for (var j=0; j<pointsArray.length; j++){

        if(pointsArray[j].connected===false){
          return false;
          break;
        }
    }
    return true;
  }

module.exports = ToolsInteraction;
