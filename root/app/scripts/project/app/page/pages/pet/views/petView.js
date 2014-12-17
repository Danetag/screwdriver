'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    PetTpl                = require('tpl/page/pet'),
    Backbone              = require('backbone');

var PetView = AbstractSectionView.extend(new function (){

  this.idView   = 'pet';
  this.id       = 'pet';

  this.template = _.template(PetTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }


});

module.exports = PetView;