'use strict';

var AbstractPageView      = require('abstract/view/DOM/page/pageView'),
    CarouselTpl           = require('components/carousel.html'),
    Config                = require('config/config'),
    Tools                 = require('tools/tools'),
    EVENT                 = require('event/event');



var CarouselView = function (options, datas){

  this.template = CarouselTpl;

  this.events = {
    "click .icon-close": "onClose",
    "touchstart .icon-close": "onClose",
    "mouseup": "onMouseUp",
    "mousedown": "onMouseDown",
    "mousemove": "onMouseMove",
    "touchstart": "onTouchStart",
    "touchmove": "onTouchMove",
    "touchend": "onTouchEnd",
    "mouseleave":"onMouseLeave"
  };
  
  this.width = 0;
  this.isDown = false;

  this.x = 0;
  this.mouseX = 0;
  this.deltaX = 0;
  this.limitMaxX = 0;

  this.FRICTION = .85;
  this.SPEED = 1.1;
  this.MARGIN_ITEM = 20;

  this.$ul = null;
  this.$li = null;

  AbstractPageView.call(this, options, datas);

};

_.extend(CarouselView, AbstractPageView);
_.extend(CarouselView.prototype, AbstractPageView.prototype);

CarouselView.prototype.initDOM = function() {

  this.$ul = this.$el.find("ul");
  this.$li = this.$ul.find("li");
  
  this.width = 0;

  AbstractPageView.prototype.initDOM.call(this)
}


CarouselView.prototype.onClose = function(e) {
  e.preventDefault();
  this.trigger(EVENT.CLOSE);
}



CarouselView.prototype.onTouchStart = function(e) {

  e.preventDefault();
  this.mouseX = e.targetTouches[0].clientX;

  _onDown.call(this);
}

CarouselView.prototype.onMouseDown = function(e) {

  Config.mainView.showSwipeCursorHolding(this.$el);

  e.preventDefault();
  this.mouseX = e.clientX;
  _onDown.call(this);

}

CarouselView.prototype.onMouseLeave = function(e) {
  _onUp.call(this);
}




var _onDown = function() {
  this.isDown = true;
}

CarouselView.prototype.onTouchMove = function(e) {

  if (this.isDown) {

    e.preventDefault();
    this.deltaX = (this.mouseX - e.targetTouches[0].clientX);

    _onMove.call(this);

  }
 
}

CarouselView.prototype.onMouseMove = function(e) {
  
  if (this.isDown) {

     //console.log("moving");
    e.preventDefault();

    this.deltaX = (this.mouseX - e.clientX);

    _onMove.call(this);
  }

}

var _onMove = function() {
}



CarouselView.prototype.onTouchEnd = function(e) {
  e.preventDefault();
  _onUp.call(this);
}

CarouselView.prototype.onMouseUp = function(e) {
  e.preventDefault();
  Config.mainView.hideSwipeCursorHolding(this.$el);
  _onUp.call(this);
}

CarouselView.prototype.onShown = function() {
  Config.mainView.showSwipeCursor(this.$el);
  this.resize();
  AbstractPageView.prototype.onShown.call(this)
}

CarouselView.prototype.hide = function() {
  Config.mainView.hideSwipeCursor(this.$el);
  AbstractPageView.prototype.hide.call(this)
}


var _onUp = function() {
  this.isDown = false;
}

CarouselView.prototype.onResize = function() {

  if (!this.$li[0].clientWidth) {
    setTimeout(CarouselView.prototype.onResize.bind(this), 200);
    return;
  } 


  var width = 0;

  $.each(this.$li, $.proxy(function(i, item){
    width += $(item).width() + this.MARGIN_ITEM;
  }, this) )

  width += this.MARGIN_ITEM;

  if (width) {
    this.width = width;
    this.$ul.width(this.width);
    this.limitMaxX = -(this.width - this.viewport.width);
  }

}

CarouselView.prototype.onUpdate = function() {

  var deltaX = this.deltaX - (this.deltaX * this.FRICTION);


  this.deltaX *= this.FRICTION;


  if (Math.abs(deltaX) <= .01)
    deltaX = 0;
  
  this.x -= deltaX;


  if (this.x <= this.limitMaxX) {
    this.x = this.limitMaxX;
  }

  if (this.x > 0)
    this.x = 0;
  

  if (Math.abs(this.deltaX) < 1)
    this.deltaX = 0;

  if (this.deltaX) {

    if (Tools.has3d())
      this.$ul[0].style[ Tools.getTransformProperty() ]   = 'translate3d('+ this.x +'px, 0, 0)';
    else
      TweenLite.set(this.$ul, {x: this.x});

  }

}

CarouselView.prototype.dispose = function() {

  this.$li = null;
  this.$ul = null;

  AbstractPageView.prototype.dispose.call(this);
}

module.exports = CarouselView;