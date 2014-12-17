'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    HydrationTpl          = require('tpl/page/hydration'),
    Backbone              = require('backbone');

var hydrationView = AbstractSectionView.extend(new function (){

  this.idView   = 'hydration';
  this.id       = 'hydration';

  this.template = _.template(HydrationTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }


});

module.exports = hydrationView;