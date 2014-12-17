'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    MedicalTpl            = require('tpl/page/medical'),
    Backbone              = require('backbone');

var MedicalView = AbstractSectionView.extend(new function (){

  this.idView   = 'medical';
  this.id       = 'medical';

  this.template = _.template(MedicalTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }


});

module.exports = MedicalView;