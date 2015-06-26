'use strict';

var EVENT             = require('event/event'),
    AbstractDOMView   = require('abstract/view/DOM/DOMView'),
    Config            = require('config/config');

/**
 * PageView: Defines a main logic for each page view
 * @extend {abstract/view/DOM/DOMView}
 * @constructor
 */
var PageView = function (options, datas){

  AbstractDOMView.call(this, options, datas);

};

_.extend(PageView, AbstractDOMView);
_.extend(PageView.prototype, AbstractDOMView.prototype);

/**
 * @override
 */
PageView.prototype.initDOM = function() {

  TweenLite.set(this.$el, {autoAlpha:0});
}


/**
 * @override
 */

PageView.prototype.show = function() {
  
	if(this.isShown) return;

  setTimeout($.proxy(function(){

    TweenLite.killTweensOf(this.$el);

    TweenLite.to(this.$el, 0.5, { 
      autoAlpha:1, 
      ease:Power2.easeInOut, 
      onComplete:this.onShown.bind(this)
    });


  },this), 0);
  
}


PageView.prototype.directShow = function() {
  TweenLite.set(this.$el, {autoAlpha:1});
  this.onShown();
}

/**
 * @override
 */
PageView.prototype.hide = function() {
  TweenLite.killTweensOf(this.$el);
  TweenLite.to(this.$el, 0.5, { autoAlpha:0, ease:Power2.easeInOut, onComplete:this.onHidden.bind(this)});
}


PageView.prototype.directHide = function() {
  TweenLite.set(this.$el, {autoAlpha:0});
  this.onHidden();
}


module.exports = PageView;