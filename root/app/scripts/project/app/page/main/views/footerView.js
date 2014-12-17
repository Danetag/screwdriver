'use strict';

var $                 = require('jquery'),
    AbstractPageView  = require('abstract/page/pageView'),
    EVENT             = require('event/event'),
    Config            = require('config/config'),
    _                 = require('underscore'),
    FooterTpl         = require('tpl/page/partial/footer'),
    PopinManager      = require('abstract/popin/popinManager'),
    Backbone          = require('backbone');

var FooterView = AbstractPageView.extend(new function (){

  this.idView = 'footer';
  this.id = "footer";

  this.template = _.template(FooterTpl);

  this.events = {
    "click .disclaimer-link": "displayPopin"
  }

  this.displayPopin = function(e) {

    var popinManager = PopinManager.getInstance();
    popinManager.display('disclaimer');
    
  }


});

module.exports = FooterView;