'use strict';

var $                         = require('jquery'),
    EVENT                     = require('event/event'),
    AbstractPageView          = require('abstract/page/pageView'),
    Config                    = require('config/config'),
    _                         = require('underscore'),
    Popin                     = require('abstract/popin/popinView'),
    PopinTpl                  = require('tpl/popin/layout'),
    PopinFoodTpl              = require('tpl/popin/food'),
    PopinDisclaimerTpl        = require('tpl/popin/disclaimer'),
    PopinShelterTpl           = require('tpl/popin/shelter'),
    PopinFirstAidTpl          = require('tpl/popin/firstaid'),
    PopinMonocularTpl         = require('tpl/popin/monocular'),
    PopinSurefireTpl          = require('tpl/popin/surefire'),
    PopinSurefireVampireTpl   = require('tpl/popin/surefirevampire'),
    PopinSatellitePhone       = require('tpl/popin/satellitephone'),
    YoutubeTpl                = require('tpl/page/partial/popin-youtube'),
    Backbone                  = require('backbone');

var popinManager = (function() {

  var _instance = null;

  var PopinManager = AbstractPageView.extend(new function (){

    /*
     * template
     * @type {_.template}
     */
    this.template = _.template(PopinTpl);

    this.currentPopin = null;

    this.events = {
      "click .popin-close": "hide",
      "click .popin-background": "hide",
    }

    this.templatesID = {
      'disclaimer': PopinDisclaimerTpl,
      'shelter': PopinShelterTpl,
      'monocular': PopinMonocularTpl,
      'surefire': PopinSurefireTpl,
      'surefireVampire': PopinSurefireVampireTpl,
      'food': PopinFoodTpl,
      'firstaid': PopinFirstAidTpl,
      'youtube': YoutubeTpl,
      'satellitephone': PopinSatellitePhone
    }

    this.idView = 'popin-container';
    this.id = "popin-container";

    this.initialize = function(options) {
      AbstractPageView.prototype.initialize.call(this, options);

      this.init();
      this.appendToContainer();
    }

    this.initDOM = function() {
      this.$background = this.$el.find(".popin-background");
      this.$contentWrapper = this.$el.find(".popin-content-wrapper");
      this.$content = this.$el.find(".popin-content");
    }

    this.display = function(tpl) {

      var popinTpl = this.templatesID[tpl];

      if (popinTpl == undefined) {
        console.log('you forgot to register the popin!');
        return;
      }

      this.currentPopin = new Popin({tpl:popinTpl});
      this.$content.append(this.currentPopin.$el);

      this.show();

    }

    this.show = function() {

      if (this.currentPopin == null) {
        console.log('Display a popin before showing it!');
        return;
      }

      this.$el.addClass('display');

      TweenLite.set(this.$background, {autoAlpha:0});
      TweenLite.set(this.$contentWrapper, {autoAlpha:0, y: 100});

      TweenLite.to(this.$background, .3, {autoAlpha:1, ease:Cubic.easeOut});
      TweenLite.to(this.$contentWrapper, .3, {autoAlpha:1, y:0, delay:.2, ease:Cubic.easeOut});

    }

    this.hide = function() {

      TweenLite.to(this.$background, .3, {autoAlpha:0, ease:Cubic.easeOut});
      TweenLite.to(this.$contentWrapper, .3, {autoAlpha:0, ease:Cubic.easeOut, onComplete:_onHidden.bind(this)});
    }

    var _onHidden = function() {

      this.$el.removeClass('display');

      this.currentPopin.dispose();
      this.currentPopin = null;

      this.$content.empty();
    
    }

    this.appendToContainer = function() {
      $('body').append(this.$el);
    }


  });

  // Expose only the getInstance method.
  return {
    getInstance: function() {
      _instance = _instance || new PopinManager();
      return _instance;
    }
  }

})();


module.exports = popinManager;