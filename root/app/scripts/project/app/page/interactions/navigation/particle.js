var Tools         = require('tools/tools'),
    EVENT         = require('event/event'),
    _             = require('underscore'),
    Backbone      = require('backbone'),
    $             = require('jquery');

var Particle = function(options) {

    PIXI.Sprite.call(this);
    
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
  }

  Particle.prototype = Object.create(PIXI.Sprite.prototype);
  Particle.prototype.constructor = Particle;

  Particle.prototype.init = function(){
    
  }

module.exports = Particle;