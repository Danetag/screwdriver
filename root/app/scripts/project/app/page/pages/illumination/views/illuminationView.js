'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    IlluminationTpl       = require('tpl/page/illumination'),
    PopinManager      = require('abstract/popin/popinManager'),
    Backbone              = require('backbone');

var IlluminationView = AbstractSectionView.extend(new function (){

  this.idView   = 'illumination';
  this.id       = 'illumination';

  this.template = _.template(IlluminationTpl);

  this.events = {
    "click #nightvision-video" : "displayPopin"
  },

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  },

  this.displayPopin = function(){

    var popinManager = PopinManager.getInstance();
    popinManager.display('youtube');
    popinManager.currentPopin.initPlayer();

  }


});

module.exports = IlluminationView;