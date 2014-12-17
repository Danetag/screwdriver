'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    CommunicationTpl      = require('tpl/page/communication'),
    PopinManager           = require('abstract/popin/popinManager'),
    Backbone              = require('backbone');

var CommunicationView = AbstractSectionView.extend(new function (){

  this.idView   = 'communication';
  this.id       = 'communication';

  this.template = _.template(CommunicationTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }

  this.events = {
    "click .more-features" : "_onMoreFeatures"
  }

  this._onMoreFeatures = function() {
    var popinManager = PopinManager.getInstance();
    popinManager.display('satellitephone');
  }


});

module.exports = CommunicationView;