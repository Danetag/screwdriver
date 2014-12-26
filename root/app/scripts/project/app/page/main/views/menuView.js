'use strict';

var $                 = require('jquery'),
    AbstractPageView  = require('abstract/page/pageView'),
    Router            = require('router/router'),
    EVENT             = require('event/event'),
    Config            = require('config/config'),
    Backbone          = require('backbone');

var MenuView = AbstractPageView.extend(new function (){

  this.idView = 'menu';
  this.id = "menu";

  this.events = {
    "click a": "onMenuClicked"
  }

  this.initDOM = function() {
    this.$button = $('#menu-button');
  }

  this.bindEvents = function() {
    this.$button.on('click', _onButtonClick.bind(this));
  }
 
  this.onMenuClicked = function(e) {

    e.preventDefault();

    var href = $(e.currentTarget).attr('href').replace(Config.baseUrl, '');
    Backbone.history.navigate(href, { trigger: true })
  }

  this.navigateById = function(id) {
    var $a = this.$el.find('a[data-id='+id+']');
    if ($a[0] != undefined) $a.trigger('click');
  }

  var _onButtonClick = function() {
    this.trigger(EVENT.TOGGLE_MENU);
  }

});

module.exports = MenuView;