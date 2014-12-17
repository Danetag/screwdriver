'use strict';

var Tools           = require('tools/tools'),
    EVENT           = require('event/event'),
    $               = require('jquery'),
    Interaction     = require('abstract/interaction'),
    _               = require('underscore'),
    Backbone        = require('backbone');


var MedicalInteraction = function(options) {

  this.alphaBG = 0;

  this.mainLine = null;
  this.endLine = null;
  this.containerInjury = null;
  this.spriteInjuryTop = null;
  this.spriteInjuryBottom = null;
  this.containerBG = null;
  this.maskTop = null;
  this.maskBottom = null;
  this.containerBGLinesRow = null;
  this.containerBGLinesCeil = null;
  this.spriteGreenGradient = null;
  this.hitAreaGraphic = null;
  this.bg = null;

  this.nbRow = this.nbCeil = 0;

  this.closeWound = false;
  this.isClosingWound = false;

  this.config = {
    green: 0x3CA879,
    ceilHeight: 80,
    ceilWidth: 80,
    widthInjury : 400,
    heightInjury : 200,
    topCy: 31
  }

  this.coord = {
    startX: 0,
    x: 100,
    y: 0
  }

  this.currentStep = "";
  this.aSteps = [];

  Interaction.call(this);
  _.extend(this, Backbone.Events);

}

MedicalInteraction.prototype = Object.create(Interaction.prototype);
MedicalInteraction.prototype.constructor = MedicalInteraction;


MedicalInteraction.prototype.render = function() {

  this.canUpdate = true;

  _renderFakeBG.call(this);

  _renderMainLine.call(this);
  this.addChild(this.mainLine);

  _renderInjury.call(this);
  _renderHitArea.call(this);
  _renderDrag.call(this);

}

// So the scene is 100%
var _renderFakeBG = function() {

  this.bg = new PIXI.Graphics();
  this.bg.beginFill(0xFF0000, 0);
  this.bg.lineStyle(1, 0xFF0000, 0);
  this.bg.drawRect(0, 0, this.viewport.width, this.viewport.height);

  this.containerBG = new PIXI.DisplayObjectContainer();
  this.containerBG.mask = this.bg;

  var containerBGLines = new PIXI.DisplayObjectContainer();
  containerBGLines.alpha = .7;
  
  this.containerBGLinesRow = new PIXI.DisplayObjectContainer();
  this.containerBGLinesCeil = new PIXI.DisplayObjectContainer();

  containerBGLines.addChild(this.containerBGLinesRow);
  containerBGLines.addChild(this.containerBGLinesCeil);

  this.containerBG.addChild(containerBGLines);
  this.containerBG.addChild(this.bg);

  this.addChild(this.containerBG);

  // Lines
  _renderLineBG.call(this);

  //End line
  _renderEndLine.call(this);

  // green gradient
  this.spriteGreenGradient = new PIXI.Sprite(PIXI.TextureCache['medical_interaction_green']);
  var dimensions = Tools.fitImage(1280, 800, this.viewport.width, this.viewport.height);

  this.spriteGreenGradient.width = dimensions.w;
  this.spriteGreenGradient.height = dimensions.h;

  this.spriteGreenGradient.position.x = dimensions.left;
  this.spriteGreenGradient.position.y = dimensions.top;

  this.spriteGreenGradient.alpha = 0;

  this.containerBG.addChild(this.spriteGreenGradient);

}

var _renderLineBG = function(t) {

  var trace = (t != undefined) ? t : false;

  // remove previous child
  this.containerBGLinesRow.removeChildren();
  this.containerBGLinesCeil.removeChildren();

  this.containerBGLinesRow.mask = this.bg;
  this.containerBGLinesCeil.mask = this.bg;

  this.containerBGLinesRow.addChild(this.bg);
  this.containerBGLinesCeil.addChild(this.bg);

  // New ones

  this.nbRow = Math.floor(this.viewport.height / this.config.ceilHeight) + 1;
  this.nbCeil = Math.floor(this.viewport.width / this.config.ceilWidth) + 1;

  for (var i = 0; i < this.nbRow; i++) {
    _generateLineBG.call(this, 0, i * this.config.ceilHeight, this.containerBGLinesRow, trace);
  }

  for (var j = 0; j < this.nbCeil; j++) {
    _generateLineBG.call(this, j * this.config.ceilWidth, 0, this.containerBGLinesCeil, trace);
  }

}

var _renderHitArea = function() {

  this.hitAreaGraphic = new PIXI.Graphics();
  this.hitAreaGraphic.beginFill(0x000000,0);
  this.hitAreaGraphic.drawRect( 0,0,this.viewport.width,this.viewport.height);

  this.addChild(this.hitAreaGraphic);

  this.hitArea = this.hitAreaGraphic;
}

var _generateLineBG = function(x, y, container, trace) {

  var line = new PIXI.Graphics();
  line.type = "LINE";
  line.origin = {
    x: x,
    y: y
  }
  line.clear();
  line.beginFill(0xFFFFFF);
  line.lineStyle(3, 0xCCCCCC, .3);
  line.moveTo(line.origin.x, line.origin.y);

  if (trace) {
    (x == 0) ? line.lineTo(this.viewport.width, line.origin.y) : line.lineTo(line.origin.x, this.viewport.height);
  }

  container.addChild(line);
}

var _renderMainLine = function(t) {

  var trace = (t != undefined) ? t : false;

  if (this.mainLine == null) this.mainLine = new PIXI.Graphics();
  this.mainLine.clear();
  this.mainLine.origin = {
    x: 0,
    y: this.config.ceilHeight * Math.round(this.nbRow / 2)
  };
  this.mainLine.beginFill(0xFFFFFF);
  this.mainLine.lineStyle(3, 0xFFFFFF);
  this.mainLine.moveTo(this.mainLine.origin.x, this.mainLine.origin.y);

  if (trace) this.mainLine.lineTo(this.viewport.width, this.mainLine.origin.y);

}

var _renderEndLine = function() {
  this.endLine = new PIXI.Graphics();
  this.endLine.origin = {
    x: 0,
    y: this.config.ceilHeight * Math.round(this.nbRow / 2)
  };
  this.endLine.beginFill(this.config.green);
  //this.endLine.lineColor(0);
  
  this.endLine.moveTo(this.endLine.origin.x, this.endLine.origin.y);

  this.containerBG.addChild(this.endLine);

  this.endLine.lineStyle(8, this.config.green);
}

var _renderInjury = function() {

  var rectRed = new PIXI.Graphics();
  rectRed.beginFill(0x000000);
  rectRed.lineStyle(1, 0x000000);
  rectRed.drawRect(0, 0, this.config.widthInjury, this.config.heightInjury / 2);

  var rectGreen = new PIXI.Graphics();
  rectGreen.beginFill(0x000000);
  rectGreen.lineStyle(1, 0x000000);
  rectGreen.drawRect(0, 0, this.config.widthInjury, this.config.heightInjury / 2);
  
  this.containerInjury = new PIXI.DisplayObjectContainer();
  this.spriteInjuryTop = new PIXI.Sprite(rectRed.generateTexture());
  this.spriteInjuryBottom = new PIXI.Sprite(rectGreen.generateTexture());
  this.spriteInjuryBottom.y = 100;

  this.containerInjury.addChild(this.spriteInjuryTop);
  this.containerInjury.addChild(this.spriteInjuryBottom);

  //Masks
  this.maskTop = new PIXI.Graphics();
  this.maskBottom = new PIXI.Graphics();

  // Before show
  _drawMask.call(this, this.containerInjury.width);

  this.spriteInjuryTop.mask = this.maskTop;
  this.spriteInjuryBottom.mask = this.maskBottom;
  this.spriteInjuryTop.addChild(this.maskTop);
  this.spriteInjuryBottom.addChild(this.maskBottom);

  this.containerInjury.x = (this.viewport.width / 2) - this.containerInjury.width;
  this.containerInjury.y = this.mainLine.origin.y - (this.containerInjury.height / 2) + 1;

  this.addChild(this.containerInjury);

}

var _renderDrag = function() {

  var circleWhite = new PIXI.Graphics();
  circleWhite.beginFill(0xFFFFFF);
  circleWhite.lineStyle(1, 0xFFFFFF);
  circleWhite.drawCircle(0, 0, 10);

  this.spriteDrag = new PIXI.Sprite(circleWhite.generateTexture());
  this.spriteDrag.interactive = true;
  this.spriteDrag.buttonMode = true;
  this.spriteDrag.y = this.mainLine.origin.y - (this.spriteDrag.height / 2);
  this.spriteDrag.x = this.spriteDrag.width - 50;

  this.addChild(this.spriteDrag);
}

MedicalInteraction.prototype.bindEvents = function() {

  this.interactive = true;

  this.spriteDrag.mousedown = this.touchstart = $.proxy(_mouseDownHandler, this);
  
  this.mousemove = this.touchmove = $.proxy(_mouseMoveHandler, this);
  this.mouseup  = this.touchend =  $.proxy(_mouseUpHandler, this);

}

MedicalInteraction.prototype.onMouseOut = function(outWindow) {
  _mouseUpHandler.call(this);
}

var _mouseDownHandler = function(e) {

  this.isdown = true;

  this.coord.startX = e.getLocalPosition(this.stage).x - this.spriteDrag.x;
  this.coord.x = e.getLocalPosition(this.stage).x;
}


var _mouseMoveHandler = function(e) {

  console.log('_mouseMoveHandler');
  
  if (this.isdown) {
    this.coord.x = e.getLocalPosition(this.stage).x;
  }

}

var _mouseUpHandler = function() {

  this.isdown = false;

  if (this.closeWound && !this.isClosingWound) {

    // Unbind
    this.interactive = false;
    this.spriteDrag.interactive = false;
    this.isClosingWound = true;

    _createTimelineEnd.call(this);

    TweenMax.to(this.spriteDrag, .7, {x: this.viewport.width + 50, ease: Cubic.easeIn});

    // Main Line
    TweenMax.to(this.mainLine, 1, {x: this.viewport.width + 50, ease: Power2.easeIn, onComplete:$.proxy(function(){
      
      //Delete Wound 
      this.removeChild(this.containerInjury);

      this.TL.end.play();

    }, this)});

  }
}

var _drawMask = function(xStart) {

  var width = this.config.widthInjury -  xStart;
  var height = this.config.heightInjury / 2;
  var topCy = this.config.topCy - (xStart * 0.35);

  this.closeWound = false;

  if (topCy < -height) {
    topCy = -height;
    this.closeWound = true;
  }

  this.maskTop.clear();
  this.maskTop.beginFill(0xFFFFFF);
  this.maskTop.moveTo(xStart, height);
  this.maskTop.bezierCurveTo(xStart + (width / 4), -topCy, xStart + (width * 3/4), -topCy, this.config.widthInjury, height);
  this.maskTop.lineTo(xStart, height);
  this.maskTop.endFill();

  this.maskBottom.clear();
  this.maskBottom.beginFill(0xFFFFFF);
  this.maskBottom.moveTo(xStart, 0);
  this.maskBottom.bezierCurveTo(xStart + (width / 4), height + topCy, xStart + (width * 3/4), height + topCy, this.config.widthInjury, 0);
  this.maskBottom.lineTo(xStart, 0);
  this.maskBottom.endFill();

}

MedicalInteraction.prototype.show = function() {

  this.isClosingWound = true;

  // BG Gradient
  TweenMax.to(this.spriteGreenGradient,.4, {alpha: 1, ease: Power2.easeOut });

  // Drag
  TweenMax.to(this.spriteDrag,1, {x: this.coord.x, ease: Cubic.easeOut, delay:.7, onComplete:$.proxy(function(){
    this.isClosingWound = false;
  }, this) });

  //Injury
  TweenMax.to(this.containerInjury, 1, {x: (this.viewport.width - this.containerInjury.width) / 2, ease: Cubic.easeOut, delay:.3 });
  TweenMax.to({x: this.containerInjury.width}, 1, {x: 0, ease: Cubic.easeOut, delay:.3, onUpdateParams:["{self}"], 
    onUpdate:$.proxy(function(tween){
      _drawMask.call(this, tween.target.x);
    },this)
  });


  // Main Line
  TweenMax.to({width:0},1,{width: this.viewport.width, onUpdateParams:["{self}"], ease: Power2.easeOut,
      onUpdate:$.proxy(function(tween){
        this.mainLine.clear();
        this.mainLine.lineStyle(3,0xFFFFFF);
        this.mainLine.moveTo(this.mainLine.origin.x, this.mainLine.origin.y);
        this.mainLine.lineTo(tween.target.width, this.mainLine.origin.y);
      },this)
  });

  // Line BG
  var delay = 0;
  for (var i = 0; i < this.containerBGLinesRow.children.length; i++) {

    var line = this.containerBGLinesRow.children[i];

    if (line.type == "LINE") {
      delay = Math.random();
      _showLineBG.call(this, line, delay, this.viewport.width, 'x');
    }
  
  }

  delay = 0;
  for (var i = 0; i < this.containerBGLinesCeil.children.length; i++) {
    var line = this.containerBGLinesCeil.children[i];

    if (line.type == "LINE") {
      delay = Math.random();
      _showLineBG.call(this, line, delay, this.viewport.height, 'y');
    }
  }
}

var _showLineBG = function(line, delay, dest, axe) {
  TweenMax.to({width:0}, .7, {width: dest, delay: delay, onUpdateParams:["{self}"], ease: Cubic.easeOut,
      onUpdate:$.proxy(function(tween){
        line.clear();
        line.lineStyle(3, 0xCCCCCC, .3);
        line.moveTo(line.origin.x, line.origin.y);
        (axe == 'x') ? line.lineTo(tween.target.width, line.origin.y) : line.lineTo(line.origin.x, tween.target.width);
      },this)
  });
}

MedicalInteraction.prototype.hide = function() {

  TweenMax.to(this, 1, {alpha:0, ease: Cubic.easeOut, onComplete:$.proxy(function(){
    Interaction.prototype.hide.call(this);
  }, this) });

}

MedicalInteraction.prototype.onUpdate = function() {

  if (this.isClosingWound) return;

  this.spriteDrag.x -= (this.spriteDrag.x - (this.coord.x - this.coord.startX)) * .2;

  // Bounds
  if (this.spriteDrag.x < 0) this.spriteDrag.x = 0;
  if (this.spriteDrag.x + this.spriteDrag.width > this.viewport.width) this.spriteDrag.x = this.viewport.width - this.spriteDrag.width;

  // Closing wound
  if (this.spriteDrag.x + this.spriteDrag.width > this.containerInjury.x) {
    var offsetX = this.spriteDrag.x + this.spriteDrag.width - this.containerInjury.x;
    _drawMask.call(this, offsetX);
  }

}

MedicalInteraction.prototype.onResize = function() {
  
  //Bg
  if (this.bg != null) {

    this.bg.clear();
    this.bg.beginFill(0xFF0000, 0);
    this.bg.lineStyle(1, 0xFF0000, 0);
    this.bg.drawRect(0, 0, this.viewport.width, this.viewport.height);

    _renderLineBG.call(this, true);
    _renderMainLine.call(this, true);

    //hit area
    this.hitAreaGraphic.width = dimensions.w;
    this.hitAreaGraphic.height = dimensions.h;

    // Drag
    this.spriteDrag.y = this.mainLine.origin.y - (this.spriteDrag.height / 2);

    //Injury
    this.containerInjury.x = (this.viewport.width - this.containerInjury.width) / 2;
    this.containerInjury.y = this.mainLine.origin.y - (this.containerInjury.height / 2) + 1;

    //End line
    //this.endLine.origin.y =  this.config.ceilHeight * Math.round(this.nbRow / 2);

    // Gradient
    var dimensions = Tools.fitImage(1280, 800, this.viewport.width, this.viewport.height);

    this.spriteGreenGradient.width = dimensions.w;
    this.spriteGreenGradient.height = dimensions.h;

    this.spriteGreenGradient.position.x = dimensions.left;
    this.spriteGreenGradient.position.y = dimensions.top;


  }
  

}

var _createTimelineEnd = function() {

  this.TL.end = new TimelineMax({
    paused: true
  });

  var animStep = {
    step01: {x:this.config.ceilWidth, y: -this.config.ceilHeight * .75},
    step02: {x:this.config.ceilWidth, y: 0},
    step03: {x:this.config.ceilWidth, y: 0},
    step04: {x:this.config.ceilWidth * .75, y: -this.config.ceilHeight * 4},
    step05: {x:this.config.ceilWidth * .5, y: this.config.ceilHeight * 2},
    step06: {x:this.config.ceilWidth * .75, y: 0},
    step07: {x:this.config.ceilWidth * 1.25, y: 0},
    step08: {x:this.config.ceilWidth * 1.75, y: -this.config.ceilHeight},
    step09: {x:this.config.ceilWidth, y: 0},
    step010: {x:this.config.ceilWidth * 2, y: 0}
  }

  var middleY = this.config.ceilHeight * Math.round(this.nbRow / 2);

  // determin the total width, so we can position it in the middle
  // update the y as well
  var width = 0;
  for (var stepNb in animStep) {
    var step = animStep[stepNb];
    width += step.x;

    step.y = middleY + step.y;
  }


  var xStart = (this.viewport.width - width) / 2;
  var yStart = this.endLine.origin.y;

  var xEnd = xStart + width;
  var yEnd = animStep.step06.y;

  var lastX = xStart;
  var lastY = yStart;

  // Update X
  for (var stepNb in animStep) {
    var step = animStep[stepNb];
    step.x = lastX + step.x;
    lastX = step.x;
  }


  this.TL.end.to(
    {x:this.endLine.origin.x, y:this.endLine.origin.y, startX:this.endLine.origin.x, startY:this.endLine.origin.y}, 
    0.3, 
    { x:xStart, y:yStart, step: "step0", onUpdate:$.proxy(_onEndUpdate, this),  onUpdateParams:["{self}"] },
    0)

  lastX = xStart;
  lastY = yStart;

  for (var stepNb in animStep) {
    var step = animStep[stepNb];
    var speed = step.speed || .3;

    this.TL.end.to(
      {x:lastX, y:lastY, startX:lastX, startY:lastY}, 
      speed, 
      { x:step.x, y:step.y, step: stepNb, onUpdate:$.proxy(_onEndUpdate, this),  onUpdateParams:["{self}"] });

    lastX = step.x;
    lastY = step.y;
  }

  this.TL.end.to(
    {x:lastX, y:lastY, startX:lastX, startY:lastY}, 
    speed, 
    { x:this.viewport.width, y:middleY, step:"stepFinale", onUpdate:$.proxy(_onEndUpdate, this),  onUpdateParams:["{self}"] });

  this.TL.end.duration(1);

  this.TL.end.call($.proxy(function(){

    this.trigger(EVENT.INTERACTION_DONE);

  }, this))

}

var _onEndUpdate = function(tween) {
  //console.log('tween', tween.target.x, tween.target.y);

  
  if (this.currentStep != tween.target.step) {
    this.currentStep = tween.target.step;
    this.aSteps.push({x:tween.target.x, y: tween.target.y, startX: tween.target.startX, startY: tween.target.startY});
  }

  // update the last one
  this.aSteps[this.aSteps.length - 1].x = tween.target.x;
  this.aSteps[this.aSteps.length - 1].y = tween.target.y;

  //remove old
  this.containerBG.removeChild(this.endLine);

  this.endLine = new PIXI.Graphics();
  this.endLine.beginFill(this.config.green);
  this.endLine.lineStyle(8, this.config.green);
  this.endLine.moveTo(0, this.config.ceilHeight * Math.round(this.nbRow / 2));

  for (var i = 0; i < this.aSteps.length; i++) {

    var step = this.aSteps[i];
    this.endLine.moveTo(step.startX, step.startY);
    this.endLine.lineTo(step.x, step.y);

    if (this.aSteps[i + 1] != undefined) {
      var nextStep = this.aSteps[i + 1];
      this.endLine.quadraticCurveTo(step.x, step.y, nextStep.x, nextStep.y);
    }

    this.endLine.endFill();
    
  }

  
  this.containerBG.addChildAt(this.endLine, 1);
  
  

  //this.endLine.clear();
  //this.endLine.lineStyle(8,this.config.green);
  //this.endLine.moveTo(tween.target.startX, tween.target.startY);
  //this.endLine.lineTo(tween.target.x, tween.target.y);
  //this.endLine.endFill();
  //this.endLine.quadraticCurveTo(tween.target.startX, tween.target.startY, tween.target.x, tween.target.y) 

}

  


module.exports = MedicalInteraction;
