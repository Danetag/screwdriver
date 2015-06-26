'use strict';

var AbstractDOMView   = require('abstract/view/DOM/DOMView'),
    Router            = require('router/router'),
    EVENT             = require('event/event'),
    Config            = require('config/config'),
    Analytics         = require('app/tools/analytics');


/**
 * MenuView: Handles the #menu display/trigers the nav
 * @extend {abstract/view/DOM/DOMview}
 * @constructor
 */
var MenuView = function (options, datas){

  this.idView = 'menu';
  this.id     = "menu";

  this.events = {
    "click a": "onMenuClicked"
  }

  AbstractDOMView.call(this, options, datas);

};

_.extend(MenuView, AbstractDOMView);
_.extend(MenuView.prototype, AbstractDOMView.prototype);


/**
 * Callback on menu clicked
 * @param {jQuery.Event} e event
 */
MenuView.prototype.onMenuClicked = function(e) {

  var $el = $(e.currentTarget),
      id = $el.data('id');

  e.preventDefault();

  this.currentHREF = $el.attr('href').replace(Config.baseUrl, '');

  Backbone.history.navigate(this.currentHREF, { trigger: true });
  this.currentHREF = null;

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


module.exports = MenuView;

