'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery'),
    Interaction   = require('abstract/interaction'),
    _             = require('underscore'),
    Backbone      = require('backbone');

  var IlluminationInteraction = function(options) {

    this.conf = options || "";
    this.down = false;
    this.mousePosition = {};

    this.clickCoords={
      x:0,
      y:0
    }
    this.deltaClick = 2;
    
    this.state = 0;
    this.animating = false;

    this.Const = {
      'TYPE': 'slide',
      'WIDTH': 1024,
      'HEIGHT': 768
    }

    this.lightToggle = false;
    this.mouseX = 0;
    this.mouseY = 0;  
    this.momentum = 0.2;

    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  IlluminationInteraction.prototype = Object.create(Interaction.prototype);
  IlluminationInteraction.prototype.constructor = IlluminationInteraction;
  
  IlluminationInteraction.prototype.init = function() {

    Interaction.prototype.init.call(this);
    this.interactive = true;

  }

  IlluminationInteraction.prototype.bindEvents = function(data) {
    this.mousedown = this.touchstart = $.proxy(this.mouseDownHandler, this);
    this.mousemove = this.touchmove = $.proxy(this.mouseMoveHandler, this);
    this.mouseup   = this.touchend =  $.proxy(this.mouseUpHandler, this);
    }

  IlluminationInteraction.prototype.mouseDownHandler = function(data) {
    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;
    this.mouseX =  data.getLocalPosition(this.stage).x;
    this.mouseY =  data.getLocalPosition(this.stage).y;

    this.down = true;
  };
  
  IlluminationInteraction.prototype.mouseMoveHandler = function(data) {
     this.mouseX =  data.getLocalPosition(this.stage).x;
     this.mouseY =  data.getLocalPosition(this.stage).y;
  };  

  IlluminationInteraction.prototype.mouseUpHandler = function(data) {
    this.down = false;

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }
  };

  IlluminationInteraction.prototype.clickMenuHandler = function(data) {

    this.toggleLight(data);

  }

  IlluminationInteraction.prototype.render = function() {
      
    this.interactive=true;
    this.canUpdate = true;
    
    this.lightContainer = new PIXI.DisplayObjectContainer();
    this.lightContainer.scale.x = 0;
    this.lightContainer.scale.y = 0;

    //this.cover
    this.coverSprite = new PIXI.Sprite(PIXI.TextureCache["illumination_interaction_background"]);
    this.coverSprite.cacheAsBitmap = true;
    this.coverSprite.alpha = 1;
    // this.tint = 0x000000;
    this.addChild(this.coverSprite);
    
    this.greenOverlay = new PIXI.Graphics();
    this.greenOverlay.beginFill(0x7ab15d,0.5);
    this.greenOverlay.drawCircle(0, 0, 600);
    this.greenOverlay.scale.x = .5;
    this.greenOverlay.scale.y = .5;
    this.greenOverlay.blendMode = PIXI.blendModes.ADD;
    this.greenOverlay.endFill();
    this.lightContainer.addChild(this.greenOverlay);

    this.lightMask = new PIXI.Sprite(PIXI.TextureCache["illumination_interaction_ligthMask"]);
    this.lightMask.width = PIXI.TextureCache['illumination_interaction_ligthMask'].width;
    this.lightMask.height = PIXI.TextureCache['illumination_interaction_ligthMask'].height;
    this.lightMask.scale.x = 1;
    this.lightMask.scale.y = 1;
    this.lightMask.anchor.x = .5;
    this.lightMask.anchor.y = .5;
    this.lightMask.cacheAsBitmap = true;
    this.lightMask.alpha = 1;
    this.lightContainer.addChild(this.lightMask);

    this.ruler = new PIXI.Sprite(PIXI.TextureCache["illumination_interaction_ruler"]);
    this.ruler.width = PIXI.TextureCache['illumination_interaction_ruler'].width;
    this.ruler.height = PIXI.TextureCache['illumination_interaction_ruler'].height;
    this.ruler.scale.x = 2;
    this.ruler.scale.y = 2;
    this.ruler.anchor.x = .5;
    this.ruler.anchor.y = 0;
    this.ruler.position.y = -200;
    this.ruler.cacheAsBitmap = true;
    this.ruler.tint = "0x7fb569";
    this.ruler.alpha = 1;

    this.rulerMask = new PIXI.Graphics();
    this.rulerMask.beginFill("0x7fb569");
    this.rulerMask.drawRect(0, 0, 300, 50);
    this.rulerMask.endFill();
    this.rulerMask.position.x = -150;
    this.rulerMask.position.y = -200;
    this.lightContainer.addChild(this.rulerMask);

    this.lightContainer.addChild(this.ruler);
    this.ruler.mask = this.rulerMask;

    this.indicator = new PIXI.Sprite(PIXI.TextureCache["illumination_interaction_indicator"]);
    this.indicator.width = PIXI.TextureCache['illumination_interaction_indicator'].width;
    this.indicator.height = PIXI.TextureCache['illumination_interaction_indicator'].height;
    this.indicator.scale.x = 2;
    this.indicator.scale.y = 2;
    this.indicator.anchor.x = .5;
    this.indicator.anchor.y = 0;
    this.indicator.position.y = -150;
    this.indicator.cacheAsBitmap = true;
    this.indicator.tint = "0x7fb569";
    this.lightContainer.addChild(this.indicator);

    this.rulerLeft = new PIXI.Sprite(PIXI.TextureCache["illumination_interaction_leftRuler"]);
    this.rulerLeft.width = PIXI.TextureCache['illumination_interaction_leftRuler'].width;
    this.rulerLeft.height = PIXI.TextureCache['illumination_interaction_leftRuler'].height;
    this.rulerLeft.scale.x = 2;
    this.rulerLeft.scale.y = 2;
    this.rulerLeft.anchor.x = .5;
    this.rulerLeft.anchor.y = .5;
    this.rulerLeft.position.y = 0;
    this.rulerLeft.position.x = 180;
    this.rulerLeft.cacheAsBitmap = true;
    this.rulerLeft.tint = "0x7fb569";
    this.rulerLeft.alpha = 1;
    this.lightContainer.addChild(this.rulerLeft);

    this.leftIndicator = new PIXI.Sprite(PIXI.TextureCache["illumination_interaction_leftIndicator"]);
    this.leftIndicator.width = PIXI.TextureCache['illumination_interaction_leftIndicator'].width;
    this.leftIndicator.height = PIXI.TextureCache['illumination_interaction_leftIndicator'].height;
    this.leftIndicator.scale.x = 2;
    this.leftIndicator.scale.y = 2;
    this.leftIndicator.anchor.x = .5;
    this.leftIndicator.anchor.y = 1;
    this.leftIndicator.position.y = 125;
    this.leftIndicator.position.x = 168;
    this.leftIndicator.cacheAsBitmap = true;
    this.leftIndicator.tint = "0x7fb569";
    this.lightContainer.addChild(this.leftIndicator);

    this.coverMask = new PIXI.Graphics();
    this.coverMask.beginFill();
    this.coverMask.drawCircle(0, 0, 600);
    this.coverMask.scale.x = .5;
    this.coverMask.scale.y = .5;
    this.coverMask.endFill();
    this.lightContainer.addChild(this.coverMask);

    this.coverSprite.mask = this.coverMask;

    this.light = new PIXI.Sprite(PIXI.TextureCache['illumination_interaction_light']); 
    this.light.width = PIXI.TextureCache['illumination_interaction_light'].width;
    this.light.height = PIXI.TextureCache['illumination_interaction_light'].height;
    this.light.scale.x = 1;
    this.light.scale.y = 1;
    this.light.anchor.x = .5;
    this.light.anchor.y = .5;
    this.light.position.x = 500;
    this.light.position.y = 500;
    this.light.blendMode = PIXI.blendModes.ADD;
    this.light.alpha=1;
    this.light.tint = 0x7ab15d;
    this.lightContainer.addChild(this.light);

    this.addChild(this.lightContainer);

    this.onResize();
    this.bindEvents();
    this.displayIntroduction();
    if(Tools.isTablet()) this.toggleLight();
    if(Tools.isTablet()) this.toggleLight();

  }

  IlluminationInteraction.prototype.toggleLight = function(data) {
    this.lightToggle =! this.lightToggle;

    if(data) this.lightContainer.position.x = data.getLocalPosition(this).x;
    if(data) this.lightContainer.position.y = data.getLocalPosition(this).y;

    var scale = this.lightToggle ? .5 : 0.00001;

    //set
    // this.light.scale.x = .25;
    // this.light.scale.y = .25;
    // this.lightMask.scale.x = .5;
    // this.lightMask.scale.y = .5;
    // this.coverMask.scale.x = .25;
    // this.coverMask.scale.y = .25;
    this.lightContainer.scale.x = .5;
    this.lightContainer.scale.y = .5;


    //animate
    TweenMax.to(this.lightContainer.scale,.3,{x:scale,y:scale});
    // TweenMax.to(this.lightMask.scale,.3,{x:2*scale,y:2*scale});
    // TweenMax.to(this.light.scale,.3,{x:scale,y:scale});

    _.delay(function(){
      if(!this.lightToggle) return;
      this.toggleLight(data);
      _.delay(function(){this.trigger(EVENT.INTERACTION_DONE)}.bind(this), 100);
    }.bind(this), 5000);


  }

  IlluminationInteraction.prototype.displayIntroduction = function() {
   

  }

  IlluminationInteraction.prototype.onUpdate = function() {
    if(this.lightToggle){

      this.ruler.position.x = (-400 * (this.mouseX/this.viewport.width)) +200;

      this.lightContainer.position.x -= (this.lightContainer.position.x - this.mouseX) * this.momentum;
      this.lightContainer.position.y -= (this.lightContainer.position.y - this.mouseY) * this.momentum;
      // this.light.position.x -= (this.light.position.x - this.mouseX) * this.momentum;
      // this.light.position.y -= (this.light.position.y - this.mouseY) * this.momentum;
      // this.lightMask.position.x -= (this.lightMask.position.x - this.mouseX) * this.momentum;
      // this.lightMask.position.y -= (this.lightMask.position.y - this.mouseY) * this.momentum;
      // this.coverMask.position.x -= (this.coverMask.position.x - this.mouseX) * this.momentum;
      // this.coverMask.position.y -= (this.coverMask.position.y - this.mouseY) * this.momentum;      
    }
  }
  IlluminationInteraction.prototype.onResize = function() {
    var dimensions = Tools.fitImage(this.Const.WIDTH, this.Const.HEIGHT, this.viewport.width, this.viewport.height);
    if(this.coverSprite) this.coverSprite.scale.x = dimensions.ratio;
    if(this.coverSprite) this.coverSprite.scale.y = dimensions.ratio;
    if(this.coverSprite) this.coverSprite.position.x = dimensions.left;
    if(this.coverSprite) this.coverSprite.position.y = dimensions.top;
  }

  IlluminationInteraction.prototype.hide = function() {
    console.log("HIDE");
    _hide.call(this);
  }

  IlluminationInteraction.prototype.dispose = function() {

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

  var _checkConnectedPoints = function(pointsArray){

    for (var j=0; j<pointsArray.length; j++){

        if(pointsArray[j].connected===false){
          return false;
          break;
        }
    }
    return true;
  }

module.exports = IlluminationInteraction;
