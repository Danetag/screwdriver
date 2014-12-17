'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery'),
    Interaction   = require('abstract/interaction'),
    Point         = require('page/interactions/communication/point'),
    Line          = require('page/interactions/communication/line'),
    _             = require('underscore'),
    Backbone      = require('backbone');

  var CommunicationInteraction = function(options) {
    _.extend(this, Backbone.Events);

    this.conf = options || "";
    this.down = false;
    this.mousePosition = {};

    this.clickCoords={
      x:0,
      y:0
    }

    this.deltaClick = Tools.isTablet() ? 10 : 2;
    
    /* Dots Mecanis variables */
    this.step=0;
    this.pointsArray = [];
    this.activePointsArray = [];
    this.connection = false;
    this.connectionsArray = [];

    Interaction.call(this);

  }

  CommunicationInteraction.prototype = Object.create(Interaction.prototype);
  CommunicationInteraction.prototype.constructor = CommunicationInteraction;
  
  CommunicationInteraction.prototype.init = function() {
    this.interactive = false;

    Interaction.prototype.init.call(this);
  
  }


  CommunicationInteraction.prototype.bindEvents = function(data) {
    this.mousedown = this.touchstart = $.proxy(this.mouseDownHandler, this);
    this.mousemove = this.touchmove = $.proxy(this.mouseMoveHandler, this);
    this.mouseup   = this.touchend =  $.proxy(this.mouseUpHandler, this);
  }

  CommunicationInteraction.prototype.mouseDownHandler = function(data) {
    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;

    this.down = true;
  };
  
  CommunicationInteraction.prototype.mouseMoveHandler = function(data) {
    
    if(this.down){
      this.mousePosition.x=data.getLocalPosition(this).x;
      this.mousePosition.y=data.getLocalPosition(this).y;

      if(this.line.connected === false) this.line.destination.x = this.mousePosition.x;
      if(this.line.connected === false) this.line.destination.y = this.mousePosition.y;

      for (var i=0; i<this.activePointsArray.length; i++){
        var currentPoint = this.activePointsArray[i];
        var currentPoint = this.activePointsArray[i];
        var pointX = currentPoint.position.x;
        var pointY = currentPoint.position.y;

        if((this.mousePosition.x<pointX+10 && this.mousePosition.x> pointX-10)&&(this.mousePosition.y<pointY+10 && this.mousePosition.y> pointY-10)){    
          
          //line connected
          if(this.line.connected) return;

          //connect origin
          this.currentPoint.connected = true;
          //connect destination
          currentPoint.connected = true;

          this.connection = true;
          this.connectedPoint = currentPoint;
          this.line.connected = true;

          this.line.destinationPoint = this.connectedPoint;
          this.line.destination.x = this.connectedPoint.position.x;
          this.line.destination.y = this.connectedPoint.position.y;
          var oldLine = this.line;
          this.connectionsArray.push(oldLine);
          this.currentPoint.connections.push(oldLine);

        }
      }

    }

  };  

  CommunicationInteraction.prototype.mouseUpHandler = function(data) {
    this.down = false;

    if(!this.line.connected) this.line.restartLine();

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }
  };

  CommunicationInteraction.prototype.clickMenuHandler = function(data) {

    this.lazer = new PIXI.Sprite(PIXI.TextureCache['communication_interaction_line']);
    this.lazer.width = PIXI.TextureCache['communication_interaction_line'].width;
    this.lazer.height = PIXI.TextureCache['communication_interaction_line'].height;
    this.lazer.scale.x = .25;
    this.lazer.scale.y = .5;
    this.lazer.anchor.x = .5;
    this.lazer.anchor.y = .5;
    this.lazer.position.x = this.clickCoords.x;
    this.lazer.position.y = this.clickCoords.y;
    this.lazer.alpha = 1;
    this.lazer.cacheAsBitmap = true;

    var x1 = this.clickCoords.x;
    var x2 = this.pointsArray[0].position.x;
    var y1 = this.clickCoords.y;
    var y2 = this.pointsArray[0].position.y;

    //calculate distance between the click and the circle to throw the lazer PEW PEW
    var dx = x1 - x2;
    var dy = y1 - y2;
    var theta = Math.atan2(dy, dx);

    this.lazer.rotation = theta;

    this.addChild(this.lazer);

    var distance = Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );

    var duration = distance/400;


    //lazer Animation
    TweenMax.to(this.lazer.scale,duration/2,{x : .2, ease : Power2.easeOut});
    TweenMax.to(this.lazer.scale,duration/2,{x : 0 , delay:(duration/2),ease : Power1.easeOut});

    TweenMax.to(this.lazer.position,duration,{
      x : this.pointsArray[0].position.x,
      y : this.pointsArray[0].position.y,
      ease : Power2.easeOut,
      onComplete:function(){
        this.pointsArray[0].triggerSignal();
        if(this.step===0) this.displayPoints();
        if(this.step===1) this.triggerConnection();
      }.bind(this)
    });

  }

  CommunicationInteraction.prototype.render = function() {

    Interaction.prototype.render.call(this);

    this.interactive = true;
    this.buttonMode = true;


    this.hitAreaGraphic = new PIXI.Graphics();
    this.hitAreaGraphic.beginFill(0x000000,0);
    this.hitAreaGraphic.drawRect ( 0,0,this.viewport.width,this.viewport.height);
    this.addChild(this.hitAreaGraphic);

    this.hitArea = this.hitAreaGraphic;

    this.canUpdate = false;

    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, this._width, this._height);
    graphics.alpha = 0;

    this.addChild(graphics);
    
    this.line = new Line();
    this.listenTo(this.line, EVENT.LINE_CONNECTED, $.proxy(this.checkConnection, this));
    this.addChild( this.line);

    this.bindEvents();
    this.onResize();
    this.renderPoints();
    this.displayIntroduction();
  }

  CommunicationInteraction.prototype.renderPoints = function(){
    //CIRCLE Introduction
    for (var key in this.conf.points) {
        var option = this.conf.points[key];
        var point = new Point(option);
        point.resize(this.viewport);
        point.render();

        this.listenTo(point, EVENT.CLICK_POINT, $.proxy(this.setCurrentPoint, this));
        this.addChild(point);
        this.pointsArray.push(point);
    }

    this.pointsArray[0].show();
    this.pointsArray[0].triggerSignal();
  }

  CommunicationInteraction.prototype.displayIntroduction = function(){
    

  }

  CommunicationInteraction.prototype.displayPoints = function(){

    for (var i=0; i<this.pointsArray.length; i++){
      if(i!=0) this.pointsArray[i].show();
    }

    this.pointsArray[0].updatePosition();
    this.pointsArray[0].initState = false;

    this.step = 1;
    this.canUpdate=true;
  }

  CommunicationInteraction.prototype.triggerConnection = function(){
    
    // for (var i=0; i<this.pointsArray.length; i++){
    for (var i=0; i<1; i++){
      var currentPoint = this.pointsArray[i];
      if(currentPoint.connections.length>0){
        for (var j=0; j<currentPoint.connections.length; j++){
          currentPoint.connections[j].updateRedLine();
        }
      }
    }
  }

  CommunicationInteraction.prototype.checkConnection = function(){

    var connectionLine = _checkConnectedLines(this.connectionsArray);
    var connectionPoint = _checkConnectedPoints(this.pointsArray);
    
    if(connectionLine && connectionPoint) this.displayEnding();

  }

  CommunicationInteraction.prototype.displayEnding = function(){
    console.log("END");
    TweenMax.to(this,1,{alpha : 0 });
    this.trigger(EVENT.INTERACTION_DONE);
  }

  CommunicationInteraction.prototype.setCurrentPoint = function(data) {

    this.currentPoint = data.point;
    var currentIndex = this.currentPoint.id;
    this.activePointsArray = this.pointsArray.slice(0);
    this.activePointsArray.splice(currentIndex, 1);

    if(this.line.connected){
      this.line = null;
      this.line = new Line();
      this.listenTo(this.line, EVENT.LINE_CONNECTED, $.proxy(this.checkConnection, this));
      this.addChildAt(this.line,0);
    }

    this.line.origin = this.currentPoint.position;

  }

  CommunicationInteraction.prototype.lineDistance = function(point1x,point1y,point2x,point2y) {
    var xs = 0;
    var ys = 0;

    xs = point2x - point1x;
    xs = xs * xs;

    ys = point2y - point1y;
    ys = ys * ys;

    return Math.sqrt( xs + ys );
  }

  
  CommunicationInteraction.prototype.onUpdate = function() {
      if(!this.currentPoint) return;

      this.line.update();
      this.connectionsArray
      for (var i=0; i<this.connectionsArray.length; i++){

        this.connectionsArray[i].update();

      }

  }


  CommunicationInteraction.prototype.onResize = function() {

    if(this.hitAreaGraphic) this.hitAreaGraphic.beginFill(0x000000,0);
    if(this.hitAreaGraphic) this.hitAreaGraphic.drawRect ( 0,0,this.viewport.width,this.viewport.height);

    for (var i=0; i<this.pointsArray.length; i++){
      this.pointsArray[i].resize(this.viewport);
    }

    if(this.line) this.line.resize();
    for (var i=0; i<this.connectionsArray.length; i++){
      this.connectionsArray[i].resize(this.viewport);
    }
  } 

  CommunicationInteraction.prototype.hide = function() {
    console.log("HIDE");
    _hide.call(this);
  }

  CommunicationInteraction.prototype.dispose = function() {

    this.canUpdate = false;    

  }
  var _hide = function() {
    console.log("_HIDE");
    this.canUpdate = false;
    TweenLite.to(this, .7, {  alpha:0, ease: Cubic.easeOut, onComplete:$.proxy(_onHidden, this) });
  }

  var _onHidden = function() {
    this.removeChild(this.sliceContainer);
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


  var _checkConnectedLines = function(connectionsArray){

    for (var j=0; j<connectionsArray.length; j++){

        if(connectionsArray[j].connectionActive===false){
          return false;
          break;
        }
    }

    return true;

  }


module.exports = CommunicationInteraction;
