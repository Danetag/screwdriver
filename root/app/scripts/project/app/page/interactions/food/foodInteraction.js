'use strict';

var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    $             = require('jquery'),
    Interaction   = require('abstract/interaction'),
    _             = require('underscore'),
    Backbone      = require('backbone');

  var FoodInteraction = function(options) {

    this.conf = options || "";
    this.down = false;
    this.mousePosition = {};

    this.clickCoords={
      x:0,
      y:0
    }


    this.mouse={
      x:500,
      y:500
    }

    this.deltaClick = Tools.isTablet() ? 10 : 2;
    
    this.circleArray = [];
    this.circleLength = 2;

    this.state = 0;
    this.animating = false;

    this.Const = {
      'TYPE': 'slide',
      'WIDTH': 1280,
      'HEIGHT': 960
    }

    this.particle_count = Tools.isTablet() ? 300 : 2000;
    this.particles = [];
    this.particlesStep01 = [];
    this.particlesStep02 = [];


    Interaction.call(this);
    _.extend(this, Backbone.Events);

  }

  FoodInteraction.prototype = Object.create(Interaction.prototype);
  FoodInteraction.prototype.constructor = FoodInteraction;
  
  FoodInteraction.prototype.init = function() {

    Interaction.prototype.init.call(this);

  }

  FoodInteraction.prototype.bindEvents = function() {

    this.mousedown = this.touchstart = $.proxy(this.mouseDownHandler, this);
    this.mousemove = this.touchmove = $.proxy(this.mouseMoveHandler, this);
    this.mouseup   = this.touchend =  $.proxy(this.mouseUpHandler, this);

  }

  FoodInteraction.prototype.obJmouseMoveHandler = function(data){
   
  }

  FoodInteraction.prototype.mouseDownHandler = function(data) {
    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;

    this.mouse.x=data.getLocalPosition(this).x;
    this.mouse.y=data.getLocalPosition(this).y;

    this.down = true;
  };
  
  FoodInteraction.prototype.mouseMoveHandler = function(data) {

    this.mouse.x=data.getLocalPosition(this).x;
    this.mouse.y=data.getLocalPosition(this).y;
    
  };  

  FoodInteraction.prototype.mouseUpHandler = function(data) {
    this.down = false;

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }
  };

  FoodInteraction.prototype.clickMenuHandler = function(data) {

    if(this.state===0){
      for (var i = 0; i <=100; i++) 
      {

        var particle = new PIXI.Sprite(this.particleTexture);
        
        particle.speed = {x: -1+Math.random()*2, y: -2+Math.random()*1};
        particle.width = 10;
        particle.height = 10;
        particle.tint = 0xffba00;
        particle.alpha = 0;
        
        if(this.mouse.x && this.mouse.y)
        {
          particle.position.x = this.mouse.x+Math.random() * (10 - (-10)) + (-10);
          particle.position.y = this.mouse.y+Math.random() * (10 - (-10)) + (-10);
        }

        particle.life = Math.round(20+Math.random()*20);
        particle.remaining_life = particle.life;
        this.particlesStep01.push(particle);
        this.container.addChild(particle);

      }
    }
    if(this.state===1){
      for (var i = 0; i <=200; i++) 
      {

        var particle = new PIXI.Sprite(this.particleTexture);
        
        particle.speed = {x: -1+Math.random()*2, y: -2+Math.random()*1};
        particle.width = 15;
        particle.height = 15;
        particle.tint = 0xffba00;
        particle.alpha = 0;
        
        if(this.mouse.x && this.mouse.y)
        {
          particle.position.x = this.mouse.x+Math.random() * (10 - (-10)) + (-10);
          particle.position.y = this.mouse.y+Math.random() * (10 - (-10)) + (-10);
        }

        particle.life = Math.round(30+Math.random()*20);
        particle.remaining_life = particle.life;
        this.particlesStep02.push(particle);
        this.container.addChild(particle);

      }
    }
    this.state++;
    if(this.state===2){

      for (var i = 0; i < this.particle_count; i++) 
      {

        var particle = new PIXI.Sprite(this.particleTexture);
        
        particle.speed = {x: -2.5+Math.random()*5, y: -15+Math.random()*10};
        particle.width = 10;
        particle.height = 10;
        particle.tint = 0xffba00;
        particle.alpha = 0;
        if(this.mouse.x && this.mouse.y)
        {
          particle.position.x = this.mouse.x+Math.random()*50;
          particle.position.y = this.mouse.y+Math.random()*50;
        }
        particle.life = Math.round(40+Math.random()*10);
        particle.remaining_life = particle.life;
        this.particles.push(particle);
        this.container.addChild(particle);

      }


      _.delay(function(){
          this.trigger(EVENT.INTERACTION_DONE);
      }.bind(this), 5000);
    }
    // if(this.state===1){

    //     for(var i = 0; i < 100; i++)
    //     {
    //       var p = this.particles[i+100];
          

    //       if(this.mouse.x && this.mouse.y)
    //     {
    //       p.position.x = this.mouse.x+Math.random()*20;
    //       p.position.y = this.mouse.y+Math.random()*20;
    //     }

    //     p.speed = {x: -1+Math.random()*2, y: -3+Math.random()*2};
    //     p.width = 20;
    //     p.height = 20;
    //     p.tint = 0xff0000;
    //     p.life = Math.round(40+Math.random()*40);
    //     p.remaining_life = p.life;

    //   }
    // } 

    this.canUpdate=true;  

  }

  FoodInteraction.prototype.render = function() {
    
    this.interactive = true;

    this.hitAreaGraphic = new PIXI.Graphics();
    this.hitAreaGraphic.beginFill(0x000000,0);
    this.hitAreaGraphic.drawRect ( 0,0,this.viewport.width,this.viewport.height);
    this.addChild(this.hitAreaGraphic);

    this.hitArea = this.hitAreaGraphic;

    this.particleTexture = PIXI.TextureCache['food_interaction_fireParticle'];

    this.container = new PIXI.DisplayObjectContainer();

    
    this.addChild(this.container);
    this.onResize();
    this.bindEvents();
  }

  FoodInteraction.prototype.displayIntroduction = function(){

  }


  FoodInteraction.prototype.onUpdate = function() {

    for(var i = 0; i < this.particlesStep01.length; i++){
       var p = this.particlesStep01[i];

        p.alpha = Math.round(p.remaining_life/p.life*100)/100;

        p.remaining_life--;
        p.position.x += p.speed.x;
        p.position.y += p.speed.y;

    }
    for(var i = 0; i < this.particlesStep02.length; i++){
       var p = this.particlesStep02[i];

        p.alpha = Math.round(p.remaining_life/p.life*100)/100;

        p.remaining_life--;
        p.position.x += p.speed.x;
        p.position.y += p.speed.y;

    }
    if(this.state===0 || this.state===1 || this.state===2){

      // for(var i = 0; i < 50; i++)
      // {
      //   var p = this.particles[i];

      //   p.alpha = Math.round(p.remaining_life/p.life*100)/100;

      //   p.remaining_life--;
      //   p.position.x += p.speed.x;
      //   p.position.y += p.speed.y;

      // }

      // for(var i = 0; i < 100; i++)
      // {
      //   var p = this.particles[i];

      //   p.alpha = Math.round(p.remaining_life/p.life*100)/100;

      //   p.remaining_life--;
      //   p.position.x += p.speed.x;
      //   p.position.y += p.speed.y;

      // }

    }else{

      for(var i = 0; i < this.particles.length; i++)
      {
        var p = this.particles[i];

        //changing opacity according to the life.
        //opacity goes to 0 at the end of life of a particle
        p.alpha = Math.round(p.remaining_life/p.life*100)/100;
        //a gradient instead of white fill
        
        //lets move the particles
        p.remaining_life--;
        p.position.x += p.speed.x;
        p.position.y += p.speed.y;

        if(p.remaining_life < 0 || p.radius < 0)
        {
          var min = -50;
          var max = 50;
          //a brand new particle replacing the dead one
          var randomPositionX = Math.random() * (max - min) + min;

          p.speed = {
            x: -randomPositionX/(Math.random() * (50 - 49) + 49)/2 , 
            y: -7+Math.random()*5
          };
          p.width = 15+Math.random()*15;
          p.height = 15+Math.random()*15;
          //p.tint = 0xffba00;
          p.tint = 0xfbffbf;
          if(randomPositionX>30) p.tint = 0xb30404;
          if(randomPositionX<-30) p.tint = 0xb30404;

          if(this.mouse.x && this.mouse.y)
          {
            p.position.x = this.mouse.x+randomPositionX;
            p.position.y = this.mouse.y+Math.random() * (20 - -20) + -20;
          }
          p.life = Math.round(30+Math.random()*20 );
          p.remaining_life = p.life;
          
        }else if (p.remaining_life < 15){
          p.tint = 0xb30404;

        }else if(p.remaining_life < 30){
          p.tint = 0xf46d44;

        }else if (p.remaining_life < 40){
          p.tint = 0xffba00;

        }

      }

    }

  }

  FoodInteraction.prototype.onResize = function() {
    if(this.hitAreaGraphic) this.hitAreaGraphic.clear();
    if(this.hitAreaGraphic) this.hitAreaGraphic.beginFill(0x000000,0);
    if(this.hitAreaGraphic) this.hitAreaGraphic.drawRect ( 0,0,this.viewport.width,this.viewport.height);


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

  FoodInteraction.prototype.hide = function() {
    _hide.call(this);
  }

  FoodInteraction.prototype.dispose = function() {

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


module.exports = FoodInteraction;
