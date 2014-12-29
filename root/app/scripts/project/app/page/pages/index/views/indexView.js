'use strict';

var $                     = require('jquery'),
    AbstractPageView      = require('abstract/view/DOM/page/pageView'),
    IndexTpl              = require('index.html'),
    dot                   = require('dot'),
    _                     = require('underscore'),
    Backbone              = require('backbone');



var IndexView = AbstractPageView.extend(new function (){

  this.idView = 'index';
  this.id = 'index';

  this.template = dot.template(IndexTpl);

});


module.exports = IndexView;