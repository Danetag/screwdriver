'use strict';

var $                 = require('jquery'),
    EVENT             = require('event/event'),
    AbstractDOMView   = require('abstract/view/DOM/DOMView'),
    _                 = require('underscore'),
    Backbone          = require('backbone');



/**
 * PageView: Defines a main logic for each page view
 * @extend {abstract/view/DOM/DOMView}
 * @constructor
 */
var PageView = AbstractDOMView.extend(new function (){});



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
  TweenLite.to(this.$el, 0.5, { autoAlpha:1, ease:Power2.easeInOut, onComplete:_onShown.bind(this)});
}


/**
 * @override
 */
PageView.prototype.hide = function() {
  TweenLite.to(window, 0.5, { autoAlpha:0, ease:Power2.easeInOut, onComplete:_onHidden.bind(this)});
}


/**
 * Triggered on shown
 * @private
 */
var _onShown = function() {
  AbstractDOMView.prototype.show.call(this);
}


/**
 * Triggered on hidden
 * @private
 */
var _onHidden = function() {
  AbstractDOMView.prototype.hide.call(this);
}


module.exports = PageView;