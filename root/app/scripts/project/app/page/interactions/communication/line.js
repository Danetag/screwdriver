var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    _             = require('underscore'),
    Backbone      = require('backbone'),
    $             = require('jquery');

var Line = function(options) {

    PIXI.DisplayObjectContainer.call(this);

    _.extend(this, Backbone.Events);

  	// this.id = options ? options.id : "" ;
   //  this.url = options ? options.url : "" ;
   //  this.index = options ? options.index : "" ;
   //  this.coverAsset = options ? options.assets.cover : null ;
   //  this.coverBlurAsset = options ? options.assets.cover_blur : null ;
    this.id = options ? options.id : null ;
  
    this.conf = options;   
    
    this.spring = .05;
    this.friction = .9;
    this.elastic = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      vX: 0,
      vY: 0
    }
    this.mousePosition={
      x:0,
      y:0
    }

    /* Coords points */
    this.origin = {};
    this.destination = {};
    this.originPoint;
    this.destinationPoint;
    this.connected = false;
    this.connectionActive = false;

    /* Shown/Hidden callback functions */
    this.shownCallback = null;
    this.hiddenCallback = null;

    /* Sprite */
    this.mainLine = null;
    this.redlLine = null;
    this.lineRed = null;

    /* Animation */
    this.udpatingRedline = false;

    this.distance = {
      x:0,
      y:0
    }

    this.render();

  }

  Line.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  Line.prototype.constructor = Line;

  Line.prototype.bindEvents = function() {
    
  }


  Line.prototype.clickMenuHandler = function(data){

  }

  Line.prototype.render = function(){
    
    this.mainLine = new PIXI.Graphics();
    this.redlLine = new PIXI.Graphics();
 
    this.mainLine.beginFill(0xFFFFFF);
    this.mainLine.lineStyle(5,0xFFFFFF,1);

    this.redlLine.beginFill(0xFF0000);
    this.redlLine.lineStyle(5,0xFF0000,1);

    this.addChild(this.mainLine);
    this.addChild(this.redlLine);

  }

  Line.prototype.show = function() {

  }

  Line.prototype.hide = function() {

  }

  Line.prototype.updateRedLine = function() {

    this.redlLine.clear();
    this.redlLine.lineStyle(5,0xFF0000,1);
    this.redlLine.moveTo(this.origin.x,this.origin.y);
    this.redlLine.lineTo(this.origin.x,this.origin.y);

    this.distance.x = this.origin.x;
    this.distance.y = this.origin.y;

    TweenMax.to(this.distance,1,{x:this.destination.x,y:this.destination.y,ease : Power2.easeOut,
      onUpdate:function(){
        this.redlLine.clear();
        this.redlLine.lineStyle(5,0xFF0000,1);
        this.redlLine.moveTo(this.origin.x,this.origin.y);
        this.redlLine.lineTo(this.distance.x,this.distance.y);
      }.bind(this),
      onComplete : function(){
        this.connectionActive = true;
        this.destinationPoint.triggerSignal();
        this.trigger(EVENT.LINE_CONNECTED);
        if(this.destinationPoint.connections.length>0){
          for (var j=0; j<this.destinationPoint.connections.length; j++){
            if(!this.destinationPoint.connections[j].connectionActive) this.destinationPoint.connections[j].updateRedLine();
          }
        }
      }.bind(this)

    });

  }

  Line.prototype.restartLine = function() {
    console.log("Restartx");
    this.destination.x = this.origin.x;
    this.destination.y = this.origin.y;
  }


  Line.prototype.update = function() {
    
    // if (this.connected) this.mousePosition.x = this.destination.x;
    // if (this.connected) this.mousePosition.y = this.destination.y;

    if(this.destination.x) this.elastic.targetX = this.origin.x+((this.destination.x-this.origin.x)/2);
    if(this.destination.y) this.elastic.targetY = this.origin.y+((this.destination.y-this.origin.y)/2);
    if(this.destination.x) this.elastic.vX += (this.elastic.targetX - this.elastic.currentX) * this.spring;
    if(this.destination.y) this.elastic.vY += (this.elastic.targetY - this.elastic.currentY) * this.spring;
      
    this.elastic.currentX += this.elastic.vX *= this.friction;
    this.elastic.currentY += this.elastic.vY *= this.friction;

    this.mainLine.clear();
    this.mainLine.lineStyle(5,0xFFFFFF,1);
    this.mainLine.moveTo(this.origin.x,this.origin.y);
    this.mainLine.quadraticCurveTo(this.elastic.currentX,this.elastic.currentY,this.destination.x,this.destination.y);

  };


  Line.prototype.resize = function(viewport){
    this.redlLine.clear();

    if(!this.connected){
      this.restartLine();
    }

    if(this.destinationPoint) this.destination.x = this.destinationPoint.position.x;
    if(this.destinationPoint) this.destination.y = this.destinationPoint.position.y;

  };

module.exports = Line;