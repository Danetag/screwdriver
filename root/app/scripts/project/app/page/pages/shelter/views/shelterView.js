'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    ShelterTpl            = require('tpl/page/shelter'),
    Backbone              = require('backbone');

var ShelterView = AbstractSectionView.extend(new function (){

  this.idView   = 'shelter';
  this.id       = 'shelter';

  this.template = _.template(ShelterTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }


});

module.exports = ShelterView;