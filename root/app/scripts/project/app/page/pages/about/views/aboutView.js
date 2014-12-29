'use strict';

var $                     = require('jquery'),
    AbstractPageView      = require('abstract/view/DOM/page/pageView'),
    AboutTpl              = require('about.html'),
    dot                   = require('dot'),
    _                     = require('underscore'),
    Backbone              = require('backbone');



var AboutView = AbstractPageView.extend(new function (){

  this.idView = 'about';
  this.id = 'about';

  this.template = dot.template(AboutTpl);

});


module.exports = AboutView;