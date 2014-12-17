'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery'),
    Interaction   = require('abstract/interaction'),
    Particle      = require('page/interactions/navigation/particle'),
    _             = require('underscore'),
    Backbone      = require('backbone');

  var NavigationInteraction = function(options) {

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

    this.clickCounter = 0;
    this.goal = 2; 

    this.animating = false;

    this.circleLength = 4;
    this.circleArray = [];

    this.Const = {
      'TYPE': 'slide',
      'WIDTH': 1024,
      'HEIGHT': 768
    }

    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  NavigationInteraction.prototype = Object.create(Interaction.prototype);
  NavigationInteraction.prototype.constructor = NavigationInteraction;
  
  NavigationInteraction.prototype.init = function() {

    Interaction.prototype.init.call(this);

    this.interactive = true;
  }

  NavigationInteraction.prototype.bindEvents = function(data) {
    this.circleContainer.mousedown = this.circleContainer.touchstart = $.proxy(this.mouseDownHandler, this);
    this.circleContainer.mouseup   = this.circleContainer.touchend =  $.proxy(this.mouseUpHandler, this);
    this.particleContainer.mousedown = this.particleContainer.touchstart =  $.proxy(this.particleClickHandler, this);
  }

  NavigationInteraction.prototype.particleClickHandler = function(data){
    this.particleContainer.children[0].alpha = 0;
    this.particleContainer.children[1].alpha = 0;
    this.emitter.emit = true;

    _.delay(function(){

      var maxWidth = (this.viewport.width/2) + 400;
      var minWidth = (this.viewport.width/2) - 400;
      var maxHeight = (this.viewport.height/2) + 400;
      var minHeight = (this.viewport.height/2) - 400;

      var angle = Math.random()*Math.PI*2;
      var radius = Math.random()*410;
      var x = Math.cos(angle)*radius;
      var y = Math.sin(angle)*radius;
      this.particleContainer.angle = angle;
      this.particleContainer.position.x = this.viewport.width/2 + x;
      this.particleContainer.position.y = this.viewport.height/2 + y;

      this.clickCounter++;
      if(this.clickCounter==this.goal) this.trigger(EVENT.INTERACTION_DONE);

    }.bind(this), 1000);
  }

  NavigationInteraction.prototype.mouseDownHandler = function(data) {
    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;
    this.down = true;
  };
  
  NavigationInteraction.prototype.mouseUpHandler = function(data) {
    this.down = false;

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }

  };

  NavigationInteraction.prototype.clickMenuHandler = function(data) {
    if(this.animating) return;

    this.animating = true;
    TweenMax.set(this.radar,{rotation:0});
    TweenMax.to(this.radar,1.5,{rotation:450 * (Math.PI/180),onComplete:function(){ this.animating = false  }.bind(this)});
    TweenMax.to(this.radar,1,{alpha:1});
    TweenMax.to(this.radar,1,{alpha:0,delay:.5});

    TweenMax.killTweensOf(this.particleContainer);
    this.particleContainer.children[0].alpha = 1;
    this.particleContainer.children[1].alpha = 1;
    this.particleContainer.alpha = 0;

    var DELAY = this.particleContainer.angle * (180/Math.PI)/360;
    //default value for the first point
    if(!DELAY) DELAY = .5;

    TweenMax.to(this.particleContainer,.5,{alpha:1,delay:DELAY});
    TweenMax.to(this.particleContainer,2,{alpha:0,delay:1+DELAY});

  }

  NavigationInteraction.prototype.render = function() {
    this.canUpdate = false;

    this.circleContainer = new PIXI.DisplayObjectContainer();
    this.circleContainer.interactive = true;

    this.coverSprite = new PIXI.Sprite(PIXI.TextureCache["navigation_interaction_map"]);
    this.coverSprite.cacheAsBitmap = true;
    this.coverSprite.alpha = .25
    this.addChild(this.coverSprite);

    for (var i=1; i<=this.circleLength; i++){
        var circle = new PIXI.Sprite(PIXI.TextureCache['navigation_interaction_circle0'+i]);
        circle.width = PIXI.TextureCache['navigation_interaction_circle0'+i].width;
        circle.height = PIXI.TextureCache['navigation_interaction_circle0'+i].height;
        circle.scale.x = .6;
        circle.scale.y = .6;
        circle.anchor.x = .5;
        circle.anchor.y = .5;
        circle.position.x = this.viewport.width/2;
        circle.position.y = this.viewport.height/2;
        circle.alpha = 0;
        circle.cacheAsBitmap = true;
        circle.interactive = true;
        circle.buttonMode = true;
        this.circleArray.push(circle);
        this.circleContainer.addChild(circle);
    }

    this.addChild(this.circleContainer);

    this.particleContainer = new PIXI.DisplayObjectContainer();
    this.particleContainer.interactive = true;
    this.particleContainer.position.x = 458;
    this.particleContainer.position.y = 486;
    this.particleContainer.width=40;
    this.particleContainer.height=40;
    this.particleContainer.alpha = 0;
    
    this.Obj = new PIXI.Sprite(PIXI.TextureCache['navigation_interaction_object']);
    this.Obj.width = PIXI.TextureCache['navigation_interaction_object'].width;
    this.Obj.height = PIXI.TextureCache['navigation_interaction_object'].height;
    this.Obj.scale.x = .75;
    this.Obj.scale.y = .75;
    this.Obj.anchor.x = .5;
    this.Obj.anchor.y = .5;
    this.Obj.tint = 0xFF0000;
    this.Obj.cacheAsBitmap = true;  

    this.ObjGlow = new PIXI.Sprite(PIXI.TextureCache['navigation_interaction_objectglow']);
    this.ObjGlow.width = PIXI.TextureCache['navigation_interaction_objectglow'].width;
    this.ObjGlow.height = PIXI.TextureCache['navigation_interaction_objectglow'].height;
    this.ObjGlow.scale.x = .75;
    this.ObjGlow.scale.y = .75;
    this.ObjGlow.anchor.x = .5;
    this.ObjGlow.anchor.y = .5;
    this.ObjGlow.tint = 0xFF0000;
    this.ObjGlow.cacheAsBitmap = true;

    this.particleContainer.addChild(this.Obj);
    this.particleContainer.addChild(this.ObjGlow,0);

    this.addChild(this.particleContainer);

    this.radar = new PIXI.Sprite(PIXI.TextureCache['navigation_interaction_radar']);
    this.radar.width = PIXI.TextureCache['navigation_interaction_radar'].width;
    this.radar.height = PIXI.TextureCache['navigation_interaction_radar'].height;
    this.radar.scale.x = 1;
    this.radar.scale.y = 1;
    this.radar.anchor.x = 449/449;
    this.radar.anchor.y = 441/684;
    this.radar.position.x = this.viewport.width/2;
    this.radar.position.y = (this.viewport.height/2) +4;
    this.radar.alpha = 0;
    this.radar.cacheAsBitmap = true;

    this.addChild(this.radar);

    this.dot = new PIXI.Graphics();
    this.dot.beginFill(0xFF0000, 1);
    this.dot.alpha = .5;

    this.dotContainer = new PIXI.DisplayObjectContainer();
    this.dotContainer.x =this.viewport.width/2;
    this.dotContainer.y =this.viewport.height/2;
    this.dotContainer.pivot.x = this.viewport.width/2;
    this.dotContainer.pivot.y = this.viewport.height/2;
    this.addChild(this.dotContainer);


    // Create a new emitter
    this.emitter = new cloudkid.Emitter(

      // The DisplayObjectContainer to put the emitter in
      // if using blend modes, it's important to put this
      // on top of a bitmap, and not use the PIXI.Stage
      this.particleContainer,

      // The collection of particle images to use
      [PIXI.TextureCache['navigation_interaction_object']],

        // Emitter configuration, edit this to change the look
        // of the emitter
        {
            "alpha": {
                "start": 1,
                "end": 0
            },
            "scale": {
                "start":0.75,
                "end": 0
            },
            "color": {
                "start": "ff0000",
                "end": "ffffff"
            },
            "speed": {
                "start": 120,
                "end": 10
            },
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "rotationSpeed": {
                "min": 0,
                "max": 30
            },
            "lifetime": {
                "min": 0.5,
                "max": 1
            },
            "frequency": 0.008,
            "emitterLifetime": 0.5,
            "maxParticles": 30,
            "pos": {
                "x": 0,
                "y": 0
            },
            "addAtBack": true,
            "spawnType": "circle",
            "spawnCircle": {
                "x": 0,
                "y": 0,
                "r": 10
            }
        }
    );

    this.elapsed = Date.now();

    this.bindEvents();
    this.displayIntroduction();
    this.canUpdate = true;
    this.onResize();

  }


  NavigationInteraction.prototype.displayIntroduction = function() {

    for (var i=0; i<this.circleArray.length; i++){
      var currentCircle = this.circleArray[i];
      TweenMax.to(currentCircle,.6,{alpha:1,delay:1+(.1*i)});

      TweenMax.to(currentCircle.scale,.6,{
        x : 1,
        y : 1,
        delay:1+(.1*i),
        ease : Back.easeOut,
        onComplete:function(){
              
        }.bind(this)
      });

    }
    // this.renderBackground();

  }


  NavigationInteraction.prototype.renderBackground = function(){

    for (var i=0; i<20; i++){
     for (var j=0; j<36; j++){

      this.dot.drawCircle(50*j,50*i,1);
      this.dotContainer.addChild(this.dot);

     }
    }
  }

  NavigationInteraction.prototype.onUpdate = function() {
    var now = Date.now();
    this.emitter.update((now - this.elapsed) * 0.001);
    this.elapsed = now;

  }
  NavigationInteraction.prototype.onResize = function() {

    // if(this.circle) this.circle.position.x = this.viewport.width/2;
    // if(this.circle) this.circle.position.y = this.viewport.height/2;
    for (var i=0; i<this.circleArray.length; i++){

      var currentCircle = this.circleArray[i];
      currentCircle.position.x = this.viewport.width/2;
      currentCircle.position.y = this.viewport.height/2;

    }
    var dimensions = Tools.fitImage(this.Const.WIDTH, this.Const.HEIGHT, this.viewport.width, this.viewport.height);

    if(this.coverSprite) this.coverSprite.scale.x = dimensions.ratio;
    if(this.coverSprite) this.coverSprite.scale.y = dimensions.ratio;
    if(this.coverSprite) this.coverSprite.position.x = dimensions.left;
    if(this.coverSprite) this.coverSprite.position.y = dimensions.top;

    if(this.radar) this.radar.position.x = this.viewport.width/2;
    if(this.radar) this.radar.position.y = (this.viewport.height/2) +4;

  }
  NavigationInteraction.prototype.hide = function() {
    _hide.call(this);
  }

  NavigationInteraction.prototype.dispose = function() {

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


module.exports = NavigationInteraction;
