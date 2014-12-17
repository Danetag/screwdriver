'use strict';

var $                     = require('jquery'),
    AbstractPageView      = require('abstract/page/pageView'),
    _                     = require('underscore'),
    HomeTpl               = require('tpl/page/index'),
    Backbone              = require('backbone');

var HomeView = AbstractPageView.extend(new function (){

  this.idView = 'homepage';

  this.id = 'homepage';

  /*
  this.events =  {
    "click .btn": "onBtnClicked"
  }
  */

  this.template = _.template(HomeTpl);

  /* 
   * @override
   * No content to go to, do nothing.
   */
  this.goToContent = function() {}


});

module.exports = HomeView;