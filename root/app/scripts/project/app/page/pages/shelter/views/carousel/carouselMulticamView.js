'use strict';

var $                 = require('jquery'),
    _                 = require('underscore'),
    CarouselItemView  = require('abstract/carousel/carouselItemView'),
    PopinManager      = require('abstract/popin/popinManager'),
    Backbone          = require('backbone');

var CarouselMulticamView = CarouselItemView.extend(new function (){

  this.events = {
    "click .more-features" : "_onMoreFeatures"
  }

  this._onMoreFeatures = function() {
    var popinManager = PopinManager.getInstance();
    popinManager.display('shelter');
  }


});


module.exports = CarouselMulticamView;