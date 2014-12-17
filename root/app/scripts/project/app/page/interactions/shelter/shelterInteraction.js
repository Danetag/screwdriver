'use strict';

var Tools           = require('tools/tools'),
    EVENT           = require('event/event'),
    $               = require('jquery'),
    Interaction     = require('abstract/interaction'),
    _               = require('underscore'),
    Backbone        = require('backbone'),
    Engine          = Matter.Engine,
    Bodies          = Matter.Bodies,
    Mouse           = Matter.Mouse,
    Composite       = Matter.Composite,
    Composites      = Matter.Composites,
    Constraint      = Matter.Constraint,
    Events          = Matter.Events,
    Render          = Matter.Render,
    MouseConstraint = Matter.MouseConstraint,
    World           = Matter.World;


  var ShelterInteraction = function(options) {

    this.drops = [];
    this.rains = [];
    this.marginLeft = 0;
    this.down = false;
    this.GRAVITY = -1.001;
    this.sto = null;

    this.currentNbSpriteGeneration = 0;

    this.type = {
      'DROP' : 'drop',
      'RAIN' : 'rain'
    }

    this.physic = {
      engine: null,
      mouse: null,
      woodLeft:null,
      woodTop:null,
      woodRight:null,
      top: null,
      bottom: null,
      right: null,
      left: null
    }

    this.config = {

      offsetWall: 10,
      widthWall: 50,
      widthTopLog:515,
      widthLeftLog: 56,
      heightLogs:379,

      //color
      color: 0xFFFFFF,

      //radian
      radian: -25 * Math.PI / 180,

      //hsla
      hue:0, //white
      saturation:0, //full color
      lightness:100, //full white
      alpha:0,

      //rain
      rainIntensity:300,
      nbRainParticule: 1,
      nbDrops: 3
    }

    this.shelterContainer = new PIXI.DisplayObjectContainer();
    this.rainContainer = new PIXI.SpriteBatch();

    this.shelterSprites = {
      left: null,
      right: null,
      top: null
    }
    this.texDrop = null;

    this.stopRaining = false;

    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  ShelterInteraction.prototype = Object.create(Interaction.prototype);
  ShelterInteraction.prototype.constructor = ShelterInteraction;
  
  ShelterInteraction.prototype.init = function() {
    _initEngine.call(this);
    Interaction.prototype.init.call(this);
  }

  var _initEngine = function() {
    this.physic.engine = Engine.create(document.getElementById('slider-container'));
    this.physic.engine.render.canvas.className = "debug";
  }

  ShelterInteraction.prototype.render = function() {
    _renderEngine.call(this);
    _renderPixi.call(this);
    this.canUpdate = true;
  }

  ShelterInteraction.prototype.hide = function() {
    // Stop the rain
    this.stopRaining = true;
  }

  ShelterInteraction.prototype.dispose = function() {

    _disposeEngine.call(this);
    
    this.drops.length = 0;
    this.drops = [];

    this.removeChild(this.shelterContainer);
    this.removeChild(this.rainContainer);

  }

  var _disposeEngine = function() {

    var canvas = this.physic.engine.render.canvas;
    var mouseC = this.physic.mouseC.mouse;

    _disposeEngineMouseEvent.call(this, mouseC);
    Mouse.clearSourceEvents(mouseC);

    Events.off(this.physic.engine, 'tick');
    Composite.clear(this.physic.engine.world);
    World.clear(this.physic.engine.world);
    Render.clear(this.physic.engine.render);
    Engine.clear(this.physic.engine);

    // remove canvas element
    canvas.parentElement.removeChild(canvas);

    this.physic = null;
  }

  var _disposeEngineMouseEvent = function(mouse) {

    var element = mouse.element;

    element.removeEventListener('mousemove', mouse.mousemove);
    element.removeEventListener('mousedown', mouse.mousedown);
    element.removeEventListener('mouseup', mouse.mouseup);
    
    element.removeEventListener("mousewheel", mouse.mousewheel);
    element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    element.removeEventListener('touchmove', mouse.mousemove);
    element.removeEventListener('touchstart', mouse.mousedown);
    element.removeEventListener('touchend', mouse.mouseup);
  }

  var _hide = function() {
    this.stopRaining = false;
    this.canUpdate = false;
    TweenLite.to(this.shelterContainer, .7, {  alpha:0, ease: Cubic.easeOut, onComplete:$.proxy(_onHidden, this) });
  }

  var _onHidden = function() {
    Interaction.prototype.hide.call(this);
  }

  var _renderEngine = function() {

    var x0 = this.physic.engine.render.canvas.width / 2;
    var y0 = this.physic.engine.render.canvas.height / 2;

    var width = this.physic.engine.render.canvas.width;
    var height = this.physic.engine.render.canvas.height - 1;
    var wallOptions = { 
      isStatic: true,
      render: {
        visible: false
      }
    };


    // Wood pieces
    this.physic.woodLeft  = Bodies.rectangle( (width - 350) / 2, height - (this.config.heightLogs / 2), 50, this.config.heightLogs, {density: 0.1, friction: 10, frictionAir:0, angle:0, isStatic: true});
    this.physic.woodTop   = Bodies.rectangle(100, 100, this.config.widthTopLog, this.config.widthLeftLog, {density: 0.1, friction: 1, frictionAir:0, angle:0, stiffness:0.9});
    this.physic.woodRight = Bodies.rectangle( (width + 350) / 2, height - (this.config.heightLogs / 2), 50, this.config.heightLogs, {density: 0.1, friction: 10, frictionAir:0, angle:0, isStatic: true});

    this.physic.mouseC = MouseConstraint.create(this.physic.engine, {
      constraint: {
        stiffness: 0.9
      }
    });

    //override mouse
    this.physic.mouseC.mouse = Mouse.create(document.getElementById('main-canvas'));

    this.physic.top = Bodies.rectangle(width / 2, -this.config.offsetWall, width + 2 * this.config.offsetWall, this.config.widthWall, wallOptions);
    this.physic.bottom = Bodies.rectangle(width / 2, height + this.config.offsetWall, width + 2 * this.config.offsetWall, this.config.widthWall, wallOptions);
    this.physic.right = Bodies.rectangle(width + this.config.offsetWall, height / 2, this.config.widthWall, height + 2 * this.config.offsetWall, wallOptions);
    this.physic.left = Bodies.rectangle(-this.config.offsetWall, height / 2, this.config.widthWall, height + 2 * this.config.offsetWall, wallOptions);
    

    World.add(this.physic.engine.world, [

      // Mouse constraint
      this.physic.mouseC, 

      //Wall
      this.physic.top,
      this.physic.bottom,
      this.physic.right,
      this.physic.left,
          
      this.physic.woodLeft,
      this.physic.woodTop,
      this.physic.woodRight

    ]);

    //console.log('>>> this.physic.engine.world', this.physic.engine.world);

    Engine.run(this.physic.engine);
    Events.on(this.physic.engine, 'tick', $.proxy(function(event) {

      //this.physic.woodLeft.angle = this.physic.woodRight.angle = this.physic.woodTop.angle = 0;

      // Out of bounds
      if (_isOutOfBounds.call(this, this.physic.woodTop)) {

        //remove the current ball
        Composite.remove(this.physic.engine.world, this.physic.woodTop);

        this.physic.woodTop   = Bodies.rectangle(100, 100, this.config.widthTopLog, this.config.widthLeftLog, {});

        World.add(this.physic.engine.world, [this.physic.woodTop]);

      }

      this.shelterSprites.left.x = this.physic.woodLeft.position.x //- (this.shelterSprites.left.width / 2);
      this.shelterSprites.left.y = this.physic.woodLeft.position.y //- (this.shelterSprites.left.height / 2);
      this.shelterSprites.left.rotation = this.physic.woodLeft.angle;
      //if (Math.abs(this.shelterSprites.left.rotation) < 0.1) this.shelterSprites.left.rotation = 0;

      this.shelterSprites.right.x = this.physic.woodRight.position.x //- (this.shelterSprites.right.width / 2);
      this.shelterSprites.right.y = this.physic.woodRight.position.y //- (this.shelterSprites.right.height / 2);
      this.shelterSprites.right.rotation = this.physic.woodRight.angle;
      //if (Math.abs(this.shelterSprites.right.rotation) < 0.1) this.shelterSprites.right.rotation = 0;

      this.shelterSprites.top.x = this.physic.woodTop.position.x //- (this.shelterSprites.top.width / 2);
      this.shelterSprites.top.y = this.physic.woodTop.position.y //- (this.shelterSprites.top.height / 2);
      this.shelterSprites.top.rotation = this.physic.woodTop.angle;
      //if (Math.abs(this.shelterSprites.top.rotation) < 0.1) this.shelterSprites.top.rotation = 0;


    }, this));
  }
  
  var _renderPixi = function() {

    this.addChild(this.rainContainer);
    this.addChild(this.shelterContainer);

    //one Drop
    var  maxRad = Math.random() * 10, 
         minRad = 0.4 * maxRad, 
         phase = Math.random() * 2 * Math.PI;

    var rainparticule = _renderImperfectCircle.call(this, minRad, maxRad, phase);
    this.texDrop = rainparticule.generateTexture();
    
    // Render the first rain
    _renderRaining.call(this, Math.round(this.config.rainIntensity / 30) );
    
    // Shelter
    this.shelterSprites.left = new PIXI.Sprite(PIXI.TextureCache['shelter_interaction_left']);
    this.shelterSprites.left.id = 'left';
    this.shelterSprites.left.pivot.x = this.shelterSprites.left.width / 2;
    this.shelterSprites.left.pivot.y = this.shelterSprites.left.height / 2;
    this.shelterContainer.addChild(this.shelterSprites.left);

    this.shelterSprites.right = new PIXI.Sprite(PIXI.TextureCache['shelter_interaction_left']);
    this.shelterSprites.right.id = 'right';
    this.shelterSprites.right.pivot.x = this.shelterSprites.right.width / 2;
    this.shelterSprites.right.pivot.y = this.shelterSprites.right.height / 2;
    this.shelterContainer.addChild(this.shelterSprites.right);

    this.shelterSprites.top = new PIXI.Sprite(PIXI.TextureCache['shelter_interaction_top']);
    this.shelterSprites.top.id = 'top';
    this.shelterSprites.top.pivot.x = this.shelterSprites.top.width / 2;
    this.shelterSprites.top.pivot.y = this.shelterSprites.top.height / 2;
    this.shelterContainer.addChild(this.shelterSprites.top);

  }

  var _renderRaining = function(intensity) {

    var nbSpriteToGenerate = (intensity != undefined) ? intensity : 1;

    this.currentNbSpriteGeneration += nbSpriteToGenerate;
    if (this.currentNbSpriteGeneration > this.config.rainIntensity) return;

    // Rain generation
    _renderRain.call(this, nbSpriteToGenerate);

    // Drop generation
    _renderDrop.call(this, nbSpriteToGenerate);

  }

  var _renderRain = function(nbSpriteToGenerate) {

    while (nbSpriteToGenerate--) {
      _generateRain.call(this, Math.floor((Math.random() * (this.viewport.width + this.marginLeft)) - this.marginLeft), -15);
    }

  }

  var _renderDrop = function(nbSpriteToGenerate) {

    while (nbSpriteToGenerate--) {
      _generateDrop.call(this);
    }
  }

  ShelterInteraction.prototype.onUpdate = function() {

    var nbChildren = this.rains.length;

    if (!nbChildren && this.stopRaining) {
      _hide.call(this);
      return;
    }

    // Rain
    for (var i = 0; i < nbChildren; i++) {
      var rainParticule = this.rains[i];

      if (rainParticule != undefined) {

        rainParticule.x += rainParticule.speedX;
        rainParticule.y += rainParticule.speedY;

        rainParticule.speedY *= 1.01;

        // Piece collisions
        if (_hit.call(this, rainParticule, this.shelterSprites.left)) {
          _endRainParticule.call(this, rainParticule);
        }

        if (_hit.call(this, rainParticule, this.shelterSprites.top)) {
          _endRainParticule.call(this, rainParticule);
        }

        if (_hit.call(this, rainParticule, this.shelterSprites.right)) {
          _endRainParticule.call(this, rainParticule);
        }

        // Floor collision
        if (rainParticule.y > this.viewport.height - rainParticule.height) {
          _endRainParticule.call(this, rainParticule);
        }
      }

    }

    // Is shelter built?
    if (!this.stopRaining && 
        Math.floor(this.shelterSprites.top.y + (this.shelterSprites.top.height / 2)) == Math.ceil(this.shelterSprites.left.y - (this.shelterSprites.left.height / 2))
      ){

      if (this.sto == null) {
        this.sto = setTimeout($.proxy(function(){
          // Is built !
          this.stopRaining = true;
        }, this), 1000)
      } 

    } else {
      if (this.sto != null) window.clearTimeout(this.sto);
      this.sto = null;
    }



  }

  ShelterInteraction.prototype.onResize = function() {
    //Engine
    this.physic.engine.world.bounds.max.x = this.viewport.width;
    this.physic.engine.world.bounds.max.y = this.viewport.height;

    this.physic.engine.render.canvas.width = this.viewport.width;
    this.physic.engine.render.canvas.height = this.viewport.height;

    if (this.physic.top != null) {
      var width = this.physic.engine.render.canvas.width;
      var height = this.physic.engine.render.canvas.height - 1;

      this.physic.top.position.x = width / 2;
      this.physic.top.position.y = -this.config.offsetWall;

      this.physic.bottom.position.x = width / 2;
      this.physic.bottom.position.y = height + this.config.offsetWall;

      this.physic.right.position.x = width + this.config.offsetWall;
      this.physic.right.position.y = height / 2;

      this.physic.left.position.x = -this.config.offsetWall;
      this.physic.left.position.y = height / 2;

      this.physic.woodLeft.position.x  = (width - 350) / 2;
      this.physic.woodLeft.position.y  = height - this.config.offsetWall - (this.config.heightLogs / 2)

      this.physic.woodRight.position.x  = (width + 350) / 2;
      this.physic.woodRight.position.y  = height - this.config.offsetWall - (this.config.heightLogs / 2)
    }
    
    // Pythagore, bitch
    var adj = this.viewport.height / Math.cos(this.config.radian);
    this.marginLeft = Math.sqrt(Math.pow(adj, 2) - Math.pow(this.viewport.height, 2));
  }

  var _hit = function(r1, r2) {
    return !((r2.x - r2.width / 2) > (r1.x + r1.width) || (r2.x + r2.width / 2) < r1.x ||  (r2.y - r2.height/2) > (r1.y + r1.height) || (r2.y + r2.height / 2) < r1.y);
    //return !(r2.x - r2.width / 2) > (r1.x + r1.width) || ((r2.x - r2.width / 2) + r2.width) < r1.x ||  (r2.y - r2.height / 2) > (r1.y + r1.height) || ((r2.y - r2.height / 2) + r2.height) < r1.y;
  }

  var _isOutOfBounds = function(body) {

    if (body.position.x > this.viewport.width ||
        body.position.x < 0 ||
        body.position.y < 0 || 
        body.position.y > this.viewport.height) {

      return true;

    };

    return false;
      
  }

  var _endRainParticule = function(rainParticule) {

    _drop.call(this, rainParticule.x, rainParticule.y);

    if (this.stopRaining) {
      this.rainContainer.removeChild(rainParticule);
      for (var i in this.rains) {
        if (this.rains[i].indexRain == rainParticule.indexRain) {
          this.rains.splice(i, 1);   
          break;
        }
      }
         
    }
    else {

      rainParticule.x = Math.floor((Math.random() * (this.viewport.width + this.marginLeft)) - this.marginLeft)
      rainParticule.y = 10 - this.viewport.height;
      rainParticule.speedY = (Math.random() * 20) + 20;

      //add more rain until the max
      _renderRaining.call(this, 3);
    }
    
  }

  /*
   * Generate rain particules on 1 point with different speed
   */
  var _generateRain = function(x, y) {

    var twoPi = 2 * Math.PI;
    var maxRad, minRad, phase;
    var nbRainParticule = this.config.nbRainParticule;

    while (nbRainParticule--) {

      var sprite = new PIXI.Sprite(this.texDrop);
      sprite.cacheAsBitmap = true;
      sprite.type = this.type.RAIN;
      sprite.x = x;
      sprite.y = y;
      sprite.speedX = (Math.random() * 0.25) + 10,
      sprite.speedY = (Math.random() * 20) + 20;
      sprite.alpha  = 0.1 + Math.random();
      sprite.height = (Math.random() * 60) + 5; // scale it
      sprite.width = ((Math.random() * 3) + 1); // scale it
      sprite.rotation = this.config.radian;
      sprite.indexRain = this.rains.length;

      this.rainContainer.addChild(sprite);
      this.rains.push(sprite);

    }
  }

  /*
   * Generate drop sprite
   */
  var _generateDrop = function() {

    var nbDrop = this.config.nbDrops;
    while(nbDrop--) {
      var sprite = new PIXI.Sprite(this.texDrop);
      sprite.cacheAsBitmap = true;
      sprite.type = this.type.DROP;
      sprite.isUsed = false;
      sprite.x = 0;
      sprite.y = 0;
      sprite.height = (Math.random() * 3) + 1; // scale it
      sprite.width = (Math.random() * 3) + 1; // scale it

      this.drops.push(sprite);
    }
  }

  /*
   * Pick up 3 drop sprites available
   */
  var _drop = function(x, y) {

    var nbDrop = this.drops.length;
    var nbDroped = 0;
    for (var i = 0; i < nbDrop; i++) {

      var drop = this.drops[i];
      if (drop.isUsed) continue;

      var rtl = 1;
      if (nbDroped < this.config.nbDrops) {
        if (i % 2 == 0) rtl = -1;
        _generateBezierTween.call(this, drop, x, y, rtl);
        nbDroped++;
      }
      else break;
    }

  }

  var _generateBezierTween = function(drop, x, y, rtl) {

    drop.isUsed = true;
    drop.alpha = .75;
    drop.x = x; 
    drop.y = y;
    this.rainContainer.addChild(drop);

    var destX = x + ((Math.random() * 10) + 5) * rtl;
    var anchorX1 = x + ((destX - x) / 4); 
    var anchorX2 = x + (3 * (destX - x) / 4); 
    var anchorY = y - ((Math.random() * 5) + 3);

    var bezx = { type:"soft", values:[{x:x, y:y}, {x:anchorX2, y:anchorY}, {x:destX, y:y}], quadratic:true};
    TweenMax.to(drop, .3, { bezier:bezx, alpha:0, ease: Cubic.easeOut,  onCompleteParams:["{self}"], onComplete:$.proxy(_onDroped, this) });
  }

  var _onDroped = function(tween) {
    var drop = tween.target; 
    drop.isUsed = false;
    this.rainContainer.removeChild(drop);
  } 

  var _renderImperfectCircle = function(minRad, maxRad, phase) {

    var rainparticule = new PIXI.Graphics();
    
    //rainparticule.drawRect(0, 0, 1, (Math.random() * 15) + 1);
    var x0, y0, point, rad, theta;
    var twoPi = 2 * Math.PI;
    
    //generate the random function that will be used to vary the radius, 9 iterations of subdivision
    var pointList = _setLinePoints.call(this, 4);

    rainparticule.beginFill(this.config.color, 1);
    rainparticule.lineStyle(1, this.config.color, 1);

    point = pointList.first;
    theta = phase;
    rad = minRad + point.y * (maxRad - minRad);
    x0 = 0;
    y0 = 0;

    rainparticule.moveTo(x0, y0);

    while (point.next != null) {
      point = point.next;
      theta = twoPi * point.x + phase;
      rad = minRad + point.y * (maxRad - minRad);
      x0 = rad * Math.cos(theta);
      y0 = rad * Math.sin(theta);
      rainparticule.lineTo(x0, y0);
    }

    rainparticule.endFill();  

    return rainparticule;
  }

  /*
   * Get a list of Point for an imperfect circle
   * from http://rectangleworld.com/blog/archives/413
   */
  var _setLinePoints = function(iterations) {

    var pointList = {};
    pointList.first = {x:0, y:1};
    var lastPoint = {x:1, y:1}
    var minY = 1;
    var maxY = 1;
    var point;
    var nextPoint;
    var dx, newX, newY;

    pointList.first.next = lastPoint;
    for (var i = 0; i < iterations; i++) {
      point = pointList.first;
      while (point.next != null) {
        nextPoint = point.next;
        
        dx = nextPoint.x - point.x;
        newX = 0.5*(point.x + nextPoint.x);
        newY = 0.5*(point.y + nextPoint.y);
        newY += dx*(Math.random()*2 - 1);
        
        var newPoint = {x:newX, y:newY};
        
        //min, max
        if (newY < minY) {
          minY = newY;
        }
        else if (newY > maxY) {
          maxY = newY;
        }
        
        //put between points
        newPoint.next = nextPoint;
        point.next = newPoint;
        
        point = nextPoint;
      }
    }
    
    //normalize to values between 0 and 1
    if (maxY != minY) {
      var normalizeRate = 1/(maxY - minY);
      point = pointList.first;
      while (point != null) {
        point.y = normalizeRate*(point.y - minY);
        point = point.next;
      }
    }
    //unlikely that max = min, but could happen if using zero iterations. In this case, set all points equal to 1.
    else {
      point = pointList.first;
      while (point != null) {
        point.y = 1;
        point = point.next;
      }
    }
    
    return pointList;   
  }

  


module.exports = ShelterInteraction;
