'use strict';


var AbstractDOMView     = require('abstract/view/DOM/DOMView'),
    CustomControlsTpl   = require('ui/customControls.mustache'),
    EVENT               = require('event/event'),
    Tools               = require('tools/tools'),
    Config              = require('config/config');



/**
 * CustomControls: Handles the custom controls
 * @extend {abstract/view/DOM/DOMview}
 * @constructor
 */
var CustomControls = function (options, datas){

  this.template = CustomControlsTpl;

  this.events = {
    "click .timeline" : "onTimelineClick",
    "mouseleave" : "onMouseLeave",
    "click .overlay-play" : "togglePlay"
    //"touchstart .overlay-play" : "togglePlay"
  }

  this.$timeline = null;
  this.$currentTime = null;
  this.$pauseBtn = null;

  this.playHasBeenInit = false;

  AbstractDOMView.call(this, options, datas);

};

_.extend(CustomControls, AbstractDOMView);
_.extend(CustomControls.prototype, AbstractDOMView.prototype);

CustomControls.prototype.initDOM = function() {

	this.$timeline = this.$el.find(".timeline");
  this.$timeline.addClass('hide');

	this.$currentTime = this.$timeline.find(".current-time");
	this.$pauseBtn = this.$el.find(".icon-pause");
  
}

CustomControls.prototype.initPlay = function() {

  if (this.playHasBeenInit) return;

  this.playHasBeenInit = true;

  if (Detectizr.device.type == "desktop") {
    this.$pauseBtn.addClass('hover');
  }

}

CustomControls.prototype.showPause = function() {

  this.$timeline.removeClass('hide');
  this.$pauseBtn.removeClass('hide')

  if (Detectizr.device.type == "desktop") {
    this.$pauseBtn.addClass('hover');
  }

}

CustomControls.prototype.onMouseLeave = function() {
  this.$pauseBtn.removeClass('hover');
}


CustomControls.prototype.hidePause = function() {  
  this.$timeline.addClass('hide');
  this.$pauseBtn.addClass('hide').removeClass('hover');
}


CustomControls.prototype.togglePlay = function() {
	this.trigger(EVENT.ON_TOGGLE_PLAY);
}


CustomControls.prototype.onFullscreen = function() {
  this.trigger(EVENT.ON_FULLSCREEN);
}

CustomControls.prototype.onTimelineClick = function(e) {
	var x = e.pageX - this.$el.offset().left;
	this.trigger(EVENT.ON_SEEK, {pct: x / parseInt(this.$timeline.width(), 10) })
}

CustomControls.prototype.setCurrentPctPlayed = function(pct_) {

	var pctX = (pct_ * 100).toFixed(2);
  //TweenLite.set(this.$currentTime, {x:pctX + "%", force3D: true});

  if (Tools.has3d())
    this.$currentTime[0].style[ Tools.getTransformProperty() ]   = 'translate3d('+ pctX +'%, 0, 0)';
  else
    TweenLite.set(this.$currentTime, {x:pctX + "%"});

}


CustomControls.prototype.setBufferPct = function(pct_) {
	var pctX = 100 - pct_ * 100;
	TweenLite.set(this.$buffer, {x:-pctX + "%", force3D:true})
}

CustomControls.prototype.dispose = function() {

	this.$timeline = null;
  this.$currentTime = null;
  this.$pauseBtn = null;
  
	AbstractDOMView.prototype.dispose.call(this);
}	

module.exports = CustomControls;