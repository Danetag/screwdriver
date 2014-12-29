'use strict';

var $                 = require('jquery'),
    AbstractDOMView   = require('abstract/view/DOM/DOMView'),
    Router            = require('router/router'),
    EVENT             = require('event/event'),
    Config            = require('config/config'),
    Backbone          = require('backbone');



/**
 * MenuView: Handles the menu display/trigers the nav
 * @extend {abstract/view/DOM/DOMview}
 * @constructor
 */
var MenuView = AbstractDOMView.extend(new function (){

  this.idView = 'menu';
  this.id = "menu";

  this.events = {
    "click a": "onMenuClicked"
  }

});



/**
 * @override
 */
MenuView.prototype.initDOM = function() {
  this.$button = $('#menu-button');
}


/**
 * @override
 */
MenuView.prototype.bindEvents = function() {
  this.$button.on('click', _onButtonClick.bind(this));
}


/**
 * Callback on menu clicked
 * @param {jQuery.Event} e event
 */
MenuView.prototype.onMenuClicked = function(e) {

  e.preventDefault();

  var href = $(e.currentTarget).attr('href').replace(Config.baseUrl, '');
  Backbone.history.navigate(href, { trigger: true })
}


/**
 * Navigate by id page, triggered throught the menu.
 * We used this method to be sure the page has a link pointed to it in the menu (SEO/accessiblity)
 * Yes, I know. DEAL WITH IT BRO.
 */
MenuView.prototype.navigateById = function(id) {
  var $a = this.$el.find('a[data-id='+id+']');
  if ($a[0] != undefined) $a.trigger('click');
}


/**
 * Callback to display the menu
 */
var _onButtonClick = function() {
  this.trigger(EVENT.TOGGLE_MENU);
}



module.exports = MenuView;