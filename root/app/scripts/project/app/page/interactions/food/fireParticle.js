var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    _             = require('underscore'),
    Backbone      = require('backbone'),
    $             = require('jquery');

var Particle = function(options) {

    PIXI.Sprite.call(this);
    
    //variables needed
    this.speedX,this.lifeTime,this.tint,this.texture;

  }

  Particle.prototype = Object.create(PIXI.Sprite.prototype);
  Particle.prototype.constructor = Particle;

  Particle.prototype.init = function(){
    this.render();
    
  }

  Particle.prototype.render = function(){

  }

module.exports = Particle;