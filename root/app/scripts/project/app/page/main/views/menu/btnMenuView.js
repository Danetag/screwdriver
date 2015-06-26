'use strict';

var AbstractDOMView   = require('abstract/view/DOM/DOMView'),
    BtnTpl            = require('ui/btnmenu.mustache'),
    EVENT             = require('event/event');

/**
 * BtnMenuView: Handles the display of the nav
 * @extend {abstract/view/DOM/DOMview}
 * @constructor
 */
var BtnMenuView = function (options, datas){

  this.idView = 'btn-menu-wrapper';
  this.id = "btn-menu-wrapper";

  this.events = {
    "click .menu": "onBtnMenuClicked",
    "click .back" : "onBtnBackClicked"
  }

  this.template = BtnTpl;

  AbstractDOMView.call(this, options, datas);

};

_.extend(BtnMenuView, AbstractDOMView);
_.extend(BtnMenuView.prototype, AbstractDOMView.prototype);

/**
 * Callback on onBtnMenuClicked
 * @param {jQuery.Event} e event
 */
BtnMenuView.prototype.onBtnMenuClicked = function(e) {

  e.preventDefault();
  this.trigger(EVENT.TOGGLE_MENU);
}

/**
 * Callback on back button from sub menu back to main menu.
 */
BtnMenuView.prototype.onBtnBackClicked = function(e) {
  e.preventDefault();
  this.trigger(EVENT.TOGGLE_SUB_MENU);
}

BtnMenuView.prototype.toggle = function() {
  // if btn is 'open' remove subMenu, before we remove open.
  if( this.$el.hasClass('open') ){
    this.$el.removeClass('subMenu');
  }
  
  this.$el.toggleClass('open');
}


BtnMenuView.prototype.toggleSub = function() {
  this.$el.toggleClass('subMenu');
}


module.exports = BtnMenuView;