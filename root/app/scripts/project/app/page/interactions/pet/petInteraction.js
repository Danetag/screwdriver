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
    Body            = Matter.Body,
    Vector          = Matter.Vector,
    Render          = Matter.Render,
    MouseConstraint = Matter.MouseConstraint,
    World           = Matter.World;


  var PetInteraction = function(options) {

    this.physic = {
      engine: null,
      mouse: null,
      stick:null,
      top: null,
      bottom: null,
      left: null,
      right: null
    }

    this.stickIsGoingBack = false;
    this.vectorGoingBack = null;

    this.config = {
      offsetWall: 10,
      widthWall: 50,
      stickW: PIXI.TextureCache['pet_interaction_bone'].width,
      stickH: PIXI.TextureCache['pet_interaction_bone'].height
    }

    this.sprites = {
      stick: null,
      grass: null,
      house: null,
      bg: null
    }

    this.bgContainer = null;
    this.maskBg = null;

    this.nbThrown = 0;

    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  PetInteraction.prototype = Object.create(Interaction.prototype);
  PetInteraction.prototype.constructor = PetInteraction;
  
  PetInteraction.prototype.init = function() {
    _initEngine.call(this);
    Interaction.prototype.init.call(this);
  }

  var _initEngine = function() {
    this.physic.engine = Engine.create(document.getElementById('slider-container'));
    this.physic.engine.render.canvas.className = "debug";
  }

  PetInteraction.prototype.render = function() {
    _renderEngine.call(this);
    _renderPixi.call(this);
  }

  PetInteraction.prototype.hide = function() {
    TweenLite.to(this, .7, {  alpha:0, ease: Cubic.easeOut, onComplete:$.proxy(_onHidden, this) });
  }

  PetInteraction.prototype.dispose = function() {

    _disposeEngine.call(this);

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

  var _disposeEngineMouseWheelEvent = function(mouse) {

    var element = mouse.element;

    element.removeEventListener("mousewheel", mouse.mousewheel);
    element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
  }

  var _onHidden = function() {
    Interaction.prototype.hide.call(this);
  }

  var _renderEngine = function() {

    //Vecto going back
    this.vectorGoingBack = Vector.add({x:0, y:0}, {x:-.2, y:-.10} );

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

    //PIXI.TextureCache['medical_interaction_green']

    _createStick.call(this, 200, 300);

    this.physic.mouseC = MouseConstraint.create(this.physic.engine, {
      constraint: {
        stiffness: 0.6
      }
    });

    //override mouse
    this.physic.mouseC.mouse = Mouse.create(document.getElementById('main-canvas'));
    _disposeEngineMouseWheelEvent.call(this, this.physic.mouseC.mouse);

    this.physic.top = Bodies.rectangle(width / 2, -this.config.offsetWall, width + 2 * this.config.offsetWall, this.config.widthWall, wallOptions);
    this.physic.bottom = Bodies.rectangle(width / 2, height + this.config.offsetWall, width + 2 * this.config.offsetWall, this.config.widthWall, wallOptions);
    this.physic.left = Bodies.rectangle(-this.config.offsetWall, height / 2, this.config.widthWall, height + 2 * this.config.offsetWall, wallOptions);
    //this.physic.right = Bodies.rectangle(width + this.config.offsetWall, height / 2, this.config.widthWall, height + 2 * this.config.offsetWall, wallOptions);

    World.add(this.physic.engine.world, [

      // Mouse constraint
      this.physic.mouseC, 

      //Wall
      this.physic.top,
      this.physic.bottom,
      this.physic.left,
      //this.physic.right,
          
      this.physic.stick

    ]);

    Engine.run(this.physic.engine);

    Events.on(this.physic.engine, 'tick', $.proxy(function(event) {
 
      // Out of bounds but only on y axe
      if (_isOutOfBounds.call(this, this.physic.stick) && 
          this.physic.stick.position.x < this.viewport.width &&
          this.physic.stick.position.x > 0 ) {

          //remove the current stick
          Composite.remove(this.physic.engine.world, this.physic.stick);

          //recreate it
          _createStick.call(this, 200, 300);

          World.add(this.physic.engine.world, [this.physic.stick]);

      }
      
      this.sprites.stick.x = this.physic.stick.position.x //- (this.shelterSprites.left.width / 2);
      this.sprites.stick.y = this.physic.stick.position.y //- (this.shelterSprites.left.height / 2);
      this.sprites.stick.rotation = this.physic.stick.angle;

      // If out of bounds
      if ( (this.physic.stick.position.x > this.viewport.width || 
          this.physic.stick.position.x < 0 ) && 
          !this.stickIsGoingBack) {

        this.stickIsGoingBack = true;

        setTimeout($.proxy(function(){

          var vectorBack = this.vectorGoingBack;
          var position = {x:this.viewport.width + this.config.stickW / 2 , y: this.viewport.height - this.config.offsetWall - this.config.stickH - 100 };
          
          if (this.physic.stick.position.x < 0) {
            position.x = -50;
            vectorBack = Vector.add({x:0, y:0}, {x:2, y:.2} );
          }

          //remove the current stick
          Composite.remove(this.physic.engine.world, this.physic.stick);

          //recreate it
          _createStick.call(this, position.x, position.y);

          World.add(this.physic.engine.world, [this.physic.stick]);

          Body.applyForce(this.physic.stick, this.physic.stick.position, vectorBack);

          setTimeout($.proxy(function(){
              this.stickIsGoingBack = false;

              this.nbThrown++;

              if (this.nbThrown >= 2) {
                this.trigger(EVENT.INTERACTION_DONE);
              }
              
          }, this), 300);


        }, this), 1000);

      }

    }, this));
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
  
  var _createStick = function(x, y) {
    this.physic.stick = Bodies.rectangle(x, y, this.config.stickW, this.config.stickH, {});
  }

  var _renderPixi = function() {

    // background
    this.bgContainer  = new PIXI.DisplayObjectContainer();
    this.maskBg = new PIXI.Graphics();
    this.maskBg.boundsPadding = 0;

    this.sprites.bg = new PIXI.Sprite(PIXI.TextureCache['pet_interaction_bg']);
    this.sprites.bg.cacheAsBitmap = true;
    this.bgContainer.addChild(this.sprites.bg)

    this.bgContainer.mask = this.maskBg;
    this.addChild(this.bgContainer);
    this.addChild(this.maskBg);

    // house
    this.sprites.house = new PIXI.Sprite(PIXI.TextureCache['pet_interaction_house']);
    this.sprites.house.cacheAsBitmap = true;
    this.sprites.house.x = 200;
    this.sprites.house.y = this.viewport.height - this.sprites.house.height;
    this.addChild(this.sprites.house);

    // grass
    this.sprites.grass = new PIXI.TilingSprite(PIXI.TextureCache['pet_interaction_grass'], this.viewport.width, PIXI.TextureCache['pet_interaction_grass'].height);
    this.sprites.grass.cacheAsBitmap = true;
    this.sprites.grass.y = this.viewport.height - this.sprites.grass.height;
    this.addChild(this.sprites.grass);

    // stick
    this.sprites.stick = new PIXI.Sprite(PIXI.TextureCache['pet_interaction_bone']);
    this.sprites.stick.cacheAsBitmap = true;
    this.sprites.stick.pivot.x = this.sprites.stick.width / 2;
    this.sprites.stick.pivot.y = this.sprites.stick.height / 2;
    this.addChild(this.sprites.stick);

  }


  PetInteraction.prototype.onUpdate = function() {

  }

  PetInteraction.prototype.onResize = function() {

    //Engine
    this.physic.engine.world.bounds.max.x = this.viewport.width;
    this.physic.engine.world.bounds.max.y = this.viewport.height;

    this.physic.engine.render.canvas.width = this.physic.engine.render.options.width = this.viewport.width;
    this.physic.engine.render.canvas.height = this.physic.engine.render.options.height = this.viewport.height;

    if (this.physic.top != null) {

      var dimensions = Tools.fitImage(1024, 768, this.viewport.width, this.viewport.height);
      var width = this.physic.engine.render.canvas.width;
      var height = this.physic.engine.render.canvas.height - 1;

      this.sprites.bg.width = dimensions.w;
      this.sprites.bg.height = dimensions.h;
      this.sprites.bg.position.x = dimensions.left;
      this.sprites.bg.position.y = dimensions.top;

      this.physic.top.position.x = width / 2;
      this.physic.top.position.y = -this.config.offsetWall;

      this.physic.bottom.position.x = width / 2;
      this.physic.bottom.position.y = height + this.config.offsetWall;

      this.physic.left.position.x = -this.config.offsetWall;
      this.physic.left.position.y = height / 2;

      this.sprites.grass.y = this.viewport.height - this.sprites.grass.height;
      this.sprites.grass.width = this.viewport.width;

      this.sprites.house.y = this.viewport.height - this.sprites.house.height;

      //console.log('this.physic.stick', this.physic.stick)
      //this.physic.right.position.x = width + this.config.offsetWall;
      //this.physic.right.position.y = height / 2;
    }


  
  }

module.exports = PetInteraction;
