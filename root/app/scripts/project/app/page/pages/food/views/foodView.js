'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    FoodTpl               = require('tpl/page/food'),
    Backbone              = require('backbone');

var FoodView = AbstractSectionView.extend(new function (){

  this.idView   = 'food';
  this.id       = 'food';

  this.template = _.template(FoodTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }

});

module.exports = FoodView;