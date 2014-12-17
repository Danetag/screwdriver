'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery'),
    Interaction   = require('abstract/interaction'),
    _             = require('underscore'),
    Backbone      = require('backbone');

  var HydrationInteraction = function(options) {

    this.conf = options || "";
    this.down = false;
    this.mousePosition = {};

    this.clickCoords={
      x:0,
      y:0
    }
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

    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  HydrationInteraction.prototype = Object.create(Interaction.prototype);
  HydrationInteraction.prototype.constructor = HydrationInteraction;
  
  HydrationInteraction.prototype.init = function() {

    Interaction.prototype.init.call(this);
    this.interactive = true;

  }

  HydrationInteraction.prototype.bindEvents = function(data) {
    this.mousedown = this.touchstart = $.proxy(this.mouseDownHandler, this);
    this.mousemove = this.touchmove = $.proxy(this.mouseMoveHandler, this);
    this.mouseup   = this.touchend =  $.proxy(this.mouseUpHandler, this);
    }

  HydrationInteraction.prototype.obJmouseMoveHandler = function(data){
   
  }

  HydrationInteraction.prototype.mouseDownHandler = function(data) {
    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;

    this.down = true;
  };
  
  HydrationInteraction.prototype.mouseMoveHandler = function(data) {
    
    if(this.down){
      this.mousePosition.x=data.getLocalPosition(this).x;
      this.mousePosition.y=data.getLocalPosition(this).y;
    }

  };  

  HydrationInteraction.prototype.mouseUpHandler = function(data) {
    this.down = false;

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }
  };

  HydrationInteraction.prototype.clickMenuHandler = function(data) {
    if(this.animating) return;
    this.animating =true;
    this.dropPill();
  }

  HydrationInteraction.prototype.render = function() {
    this.canUpdate = false;

    this.dirt = new PIXI.Graphics();
    this.dirt.beginFill(0x463927);
    this.dirt.alpha = .5;
    this.dirt.drawRect ( 0,0,this.viewport.width,this.viewport.height);

    this.dirtMask = new PIXI.Graphics();
    this.dirtMask.beginFill();
    this.dirtMask.drawCircle(0, 0, 0);
    this.dirtMask.endFill();

    this.dirt.mask = this.dirtMask;
    
    this.addChild(this.dirtMask);
    this.addChild(this.dirt);

    this.coverSprite = new PIXI.Sprite(PIXI.TextureCache["hydration_cover"]);
    this.coverSprite.cacheAsBitmap = true;

    this.coverMask = new PIXI.Graphics();
    this.coverMask.beginFill();
    this.coverMask.drawCircle(0, 0, 0);
    this.coverMask.endFill();

    this.coverSprite.mask = this.coverMask;
    this.addChild(this.coverMask);
    this.addChild(this.coverSprite);

    this.pill = new PIXI.Sprite(PIXI.TextureCache['hydration_interaction_pill']); 
    this.pill.width = PIXI.TextureCache['hydration_interaction_pill'].width;
    this.pill.height = PIXI.TextureCache['hydration_interaction_pill'].height;
    this.pill.anchor.x = .6;
    this.pill.anchor.y = .6;
    this.pill.scale.x =0;
    this.pill.scale.y =0;
    this.pill.alpha = 1;
    this.pill.cacheAsBitmap = true;

    for (var i=0; i<this.circleLength; i++){
        var circle = new PIXI.Graphics();
        circle.beginFill(0xFFFFFF,0);
        circle.lineStyle(3,0xFFFFFF,1);
        circle.drawCircle(0, 0, 100);
        circle.scale.x = 0;
        circle.scale.y = 0;
        circle.endFill();

        this.circleArray.push(circle);
        this.addChild(circle);
    }
    this.addChild(this.pill);

    this.onResize();
    this.bindEvents();
    this.displayIntroduction();
  }

  HydrationInteraction.prototype.displayIntroduction = function(){

    var value={size:0};

    TweenMax.to(value,2,{size:2000,ease : Power3.easeIn ,onUpdate : function(){
      this.dirtMask.clear();
      this.dirtMask.beginFill();
      this.dirtMask.drawCircle(this.viewport.width/2, this.viewport.height/2,value.size);
      this.dirtMask.endFill();

      }.bind(this)
    });


  }

  HydrationInteraction.prototype.dropPill = function() {
    

  
    this.pill.scale.x=4;
    this.pill.scale.y=4;
    this.pill.position.x = this.clickCoords.x;
    this.pill.position.y = this.clickCoords.y;
    TweenMax.to(this.pill.scale,1,{x:.7,y:.7,ease:Back.easeOut});
      
  for (var i=0; i<this.circleArray.length; i++){

      var currentCircle = this.circleArray[i];
      currentCircle.alpha = 1;

      currentCircle.scale.x = 0;
      currentCircle.scale.y = 0;

      currentCircle.position.x = this.clickCoords.x;
      currentCircle.position.y = this.clickCoords.y;

      TweenMax.to(currentCircle.scale,2,{x:2,y:2,ease:Power2.easeIn, delay:.3*i});
      TweenMax.to(currentCircle,2,{alpha : 0,ease:Power2.easeIn, delay:.3*i});

    }

    _.delay(function(){

      this.cleanWater()

    }.bind(this),2000);

  }

  HydrationInteraction.prototype.cleanWater = function() {

    TweenMax.to(this.pill.scale,1,{x:0,y:0,ease:Back.easeIn});
    TweenMax.to(this.pill,1,{alpha:0,ease:Back.easeIn});

    var currentCircle = this.circleArray[0];
    currentCircle.alpha = 1;

    currentCircle.scale.x = 0;
    currentCircle.scale.y = 0;

    TweenMax.to(currentCircle.scale,2,{x:2,y:2,ease:Power2.easeIn, delay:.2});
    TweenMax.to(currentCircle,2,{alpha : 0,ease:Power2.easeIn, delay:.2});


    _.delay(function(){

    var value={size:0};

      TweenMax.to(value,2,{size:2000,ease : Power3.easeIn ,onUpdate : function(){
        this.coverMask.clear();
        this.coverMask.beginFill();
        this.coverMask.drawCircle(this.clickCoords.x, this.clickCoords.y,value.size);
        this.coverMask.endFill();
        }.bind(this),
        onComplete : function(){
          this.hide();
        }.bind(this)
      });
      
    }.bind(this),1000);

  }


  HydrationInteraction.prototype.onUpdate = function() {

  }


  HydrationInteraction.prototype.onResize = function() {

    var dimensions = Tools.fitImage(this.Const.WIDTH, this.Const.HEIGHT, this.viewport.width, this.viewport.height);

    if(this.coverSprite) this.coverSprite.scale.x = dimensions.ratio;
    if(this.coverSprite) this.coverSprite.scale.y = dimensions.ratio;
    if(this.coverSprite) this.coverSprite.position.x = dimensions.left;
    if(this.coverSprite) this.coverSprite.position.y = dimensions.top;

    if(this.dirt){
      this.dirt.clear();
      this.dirt.beginFill(0x463927);
      this.dirt.alpha = .5;
      this.dirt.drawRect( 0,0,this.viewport.width,this.viewport.height);
    }

  } 

  HydrationInteraction.prototype.hide = function() {
    _hide.call(this);
  }

  HydrationInteraction.prototype.dispose = function() {

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


module.exports = HydrationInteraction;
