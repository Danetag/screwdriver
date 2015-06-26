'use strict';

// var $                 = require('zepto-browserify').$,
var EVENT             = require('event/event'),
    AbstractPageView  = require('abstract/view/DOM/page/pageView');
    // _                 = require('underscore'),
    //Backbone          = require('backbone');



/**
 * ManagerView: Defines a main logic for a manager view
 * @extend {abstract/view/DOM/page/pageView}
 * @constructor
 */
var ManagerView = function (options, datas){

	this.$managerContainer = null;

	this.currentView = null;
	this.previousView = null;
	this.nextView = null;

	this.x = 0;
	this.itemWidth = 0;

	AbstractDOMView.call(this, options, datas);

};

_.extend(ManagerView, AbstractDOMView);
_.extend(ManagerView.prototype, AbstractDOMView.prototype);

/**
 * Handles the initialization of DOM element
 */
ManagerView.prototype.initDOM = function() {
	AbstractPageView.prototype.initDOM.call(this);
	this.$managerContainer = this.$el;
}

ManagerView.prototype.setUpPages = function(_config) {

	this.currentView = _config.currentView;
	this.previousView = _config.previousView;
	this.nextView = _config.nextView;

	this.indexPages();
	this.onResize();
}


ManagerView.prototype.indexPages = function() {
	this.currentView.$el.after(this.nextView.$el);
	this.currentView.$el.before(this.previousView.$el);
}

ManagerView.prototype.positionPages = function() {

	// Position the container
	TweenLite.set(this.$managerContainer, {x:-this.itemWidth});

}

/**
 * @override
 */
ManagerView.prototype.show = function() {

 	this.showManagerView();

  this.listenToOnce(this.previousView, EVENT.SHOWN, this.onShown.bind(this));
  this.listenToOnce(this.currentView, EVENT.SHOWN, this.onShown.bind(this));
  this.listenToOnce(this.nextView, EVENT.SHOWN, this.onShown.bind(this));

  this.previousView.directShow();
  this.currentView.show();
  this.nextView.directShow();

}

ManagerView.prototype.showManagerView = function() {
	TweenLite.set(this.$el, {autoAlpha:1});
  	this.onShown();
}

/**
 * @override
 */
ManagerView.prototype.hide = function(hideManager_) {

	if (hideManager_) {
		this.hideManagerView();
	}

	// Hide the current
  this.listenToOnce(this.currentView, EVENT.HIDDEN, this.onHidden.bind(this));
  this.currentView.hide();

}

ManagerView.prototype.hideManagerView = function() {
	TweenLite.to(this.$el, 0.5, { autoAlpha:0, ease:Power2.easeInOut, onComplete:this.onHidden.bind(this)});
}

/**
 * @override
 */
ManagerView.prototype.onShown = function() {
	if (this.previousView.isShown && this.currentView.isShown && this.nextView.isShown){
  		AbstractPageView.prototype.onShown.call(this);
	}
}


ManagerView.prototype.onResize = function() {

	this.itemWidth = this.viewport.width;

	if (this.previousView != null) {

		TweenLite.set(this.$managerContainer, {width:this.itemWidth * 3});

		TweenLite.set(this.previousView.$el, {width:this.itemWidth});
		TweenLite.set(this.currentView.$el, {width:this.itemWidth});
		TweenLite.set(this.nextView.$el, {width:this.itemWidth});

		this.positionPages();
	}

	if (this.previousView != null)
		this.previousView.resize(this.viewport);

	if (this.currentView != null)
		this.currentView.resize(this.viewport);

	if (this.nextView != null)
		this.nextView.resize(this.viewport);

}

ManagerView.prototype.onUpdate = function() {
	this.currentView.onUpdate();
}

ManagerView.prototype.onMouseOut = function(outWindow_) {
	// this.currentView.onMouseOut(outWindow_);
}

ManagerView.prototype.onScroll = function() {

}

/**
 * @override
 */
ManagerView.prototype.onHidden = function() {

	if (!this.currentView.isShown){
  	AbstractPageView.prototype.onHidden.call(this);
  }
}

ManagerView.prototype.dispose = function() {

	this.$managerContainer = null;

	this.currentView = null;
	this.previousView = null;
	this.nextView = null;
	
  AbstractPageView.prototype.dispose.call(this);
}

module.exports = ManagerView;