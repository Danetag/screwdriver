'use strict';

var $                     = require('jquery'),
    AbstractPageView      = require('abstract/page/pageView'),
    IndexTpl              = require('index.html'),
    dot                   = require('dot'),
    Backbone              = require('backbone');

var IndexView = AbstractPageView.extend(new function (){

  this.idView = 'index';
  this.id = 'index';

  /*
  this.events =  {
    "click .btn": "onBtnClicked"
  }
  */

  this.template = dot.template(IndexTpl);

});


module.exports = IndexView;