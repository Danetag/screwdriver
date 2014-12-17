'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    NavigationTpl         = require('tpl/page/navigation'),
    Backbone              = require('backbone');

var NavigationView = AbstractSectionView.extend(new function (){

  this.idView   = 'navigation';
  this.id       = 'navigation';

  this.template = _.template(NavigationTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }


});

module.exports = NavigationView;