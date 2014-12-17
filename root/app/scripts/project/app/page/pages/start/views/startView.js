'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    StartTpl              = require('tpl/page/start'),
    EVENT                 = require('event/event'),
    Backbone              = require('backbone');

var StartView = AbstractSectionView.extend(new function (){

  this.idView   = 'start';
  this.id       = 'start';

  this.template = _.template(StartTpl);

  this.events = {
    "click .explore-button" : "exploreButton"
  }

  this.initialize = function(options){

    AbstractSectionView.prototype.initialize.call(this, options);
  
  }


  this.exploreButton = function(){

    //this.trigger
    this.trigger(EVENT.EXPLORE, {});

  }


});

module.exports = StartView;