'use strict';

var $                     = require('jquery'),
    AbstractPageView      = require('abstract/page/pageView'),
    AboutTpl              = require('about.html'),
    dot                   = require('dot'),
    Backbone              = require('backbone');

var AboutView = AbstractPageView.extend(new function (){

  this.idView = 'about';
  this.id = 'about';

  /*
  this.events =  {
    "click .btn": "onBtnClicked"
  }
  */

  this.template = dot.template(AboutTpl);

});


module.exports = AboutView;