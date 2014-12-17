'use strict';

var $                 = require('jquery'),
    AbstractPageView  = require('abstract/page/pageView'),
    EVENT             = require('event/event'),
    Config            = require('config/config'),
    Backbone          = require('backbone');

var BuyNowView = AbstractPageView.extend(new function (){

  this.idView = 'buy-now';
  this.id = "buy-now";

  this.TLInit = false;
  this.hasSelected = false;

  this.pricesLink = {
    'basic' : {
      'full' : 'http://justoneeye.com/catalog/product/view/id/25097/s/ulysses-tier-1-survival-kit/category/258/',
      'half' : 'http://justoneeye.com/catalog/product/view/id/25097/s/ulysses-tier-1-survival-kit/category/258/',
    },
    'extra' : {
      'full' : 'http://justoneeye.com/catalog/product/view/id/25100/s/ulysses-tier-1-pet-essentials-kit/category/258/',
      'half' : 'http://justoneeye.com/catalog/product/view/id/25100/s/ulysses-tier-1-pet-essentials-kit/category/258/',
    }
  }

  this.events = {
    "click .close": "onCloseClicked"
  }

  this.initDOM = function() {

    this.$button = $('#buy-now-button');

    this.$close = this.$el.find('.close');

    this.$h3Title = this.$el.find('h3 .title');
    this.$h3Subtitle = this.$el.find('h3 .subtitle');

    this.$h4Title = this.$el.find('h4 .title');
    this.$h4Subtitle = this.$el.find('h4 .subtitle');
    this.$h4MainTitle = this.$el.find('h4.main-title');

    this.$price = this.$el.find('.price');
    this.$desc = this.$el.find('.desc');

    this.$imgContent = this.$el.find('.img-content');

    this.$ctas = this.$el.find('.cta li');
    this.$fullBtn = this.$el.find('.cta a[data-rel=full]');
    this.$halfBtn = this.$el.find('.cta a[data-rel=half]');
    this.$products = this.$el.find('.products li');

    //set up
    TweenLite.set(this.$el, {autoAlpha:0});
    TweenLite.set(this.$close, {autoAlpha:0});
    TweenLite.set(this.$h3Title, {autoAlpha:0, y:-15});
    TweenLite.set(this.$h3Subtitle, {autoAlpha:0, y:-10});
    TweenLite.set(this.$imgContent, {autoAlpha:0, y:-20});
    TweenLite.set(this.$h4Title, {autoAlpha:0, y:-10});
    TweenLite.set(this.$h4Subtitle, {autoAlpha:0, y:-5});
    TweenLite.set(this.$h4MainTitle, {autoAlpha:0, y:-5});
    TweenLite.set(this.$price, {autoAlpha:0, y:-5});
    TweenLite.set(this.$desc, {autoAlpha:0, y:-5});
    TweenLite.set(this.$ctas, {autoAlpha:0, y:80});

  }

  this.initTL = function() {

    if (this.TLInit) return;

    this.TLInit = true;

    // Show
    this.TL.show = new TimelineLite({paused: true});

    this.TL.show.to(this.$el, .3, {autoAlpha:1, ease:Cubic.easeOut}, 0)
                .to(this.$close, .3, {autoAlpha:1, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h3Title, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h3Subtitle, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$imgContent, .4, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h4Title, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h4Subtitle, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h4MainTitle, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$price, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$desc, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1');

    if (this.hasSelected)        
      this.TL.show.to(this.$ctas, .3, {autoAlpha:1, y:0, ease:Cubic.easeOut}, '-=0.1');

    this.TL.hide = new TimelineLite({paused: true});

    this.TL.hide.to(this.$desc, .3, {autoAlpha:0, y:-5, ease:Cubic.easeOut}, 0)
                .to(this.$price, .3, {autoAlpha:0, y:-5, ease:Cubic.easeOut}, 0)
                .to(this.$h4Title, .3, {autoAlpha:0, y:-10, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h4Subtitle, .3, {autoAlpha:0, y:-5, ease:Cubic.easeOut}, '-=0.3')
                .to(this.$h4MainTitle, .3, {autoAlpha:0, y:-5, ease:Cubic.easeOut}, '-=0.3')
                .to(this.$imgContent, .4, {autoAlpha:0, y:-20, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h3Title, .3, {autoAlpha:0, y:-15, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$h3Subtitle, .3, {autoAlpha:0, y:-10, ease:Cubic.easeOut}, '-=0.3')
                .to(this.$close, .3, {autoAlpha:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$el, .3, {autoAlpha:0, ease:Cubic.easeOut}, '-=0.1')
                .to(this.$ctas, .3, {autoAlpha:0, y:80, ease:Cubic.easeOut}, '-=0.1');

  }

  this.bindEvents = function() {
    this.$button.on('click', _onButtonClick.bind(this));
    this.$products.on('click', _onProductClick.bind(this));
  }
 
  this.onCloseClicked = function(e) {
    this.hide();
  }

  this.show = function() {
    this.initTL();
    this.TL.show.play(0);
  }

  this.hide = function() {
    this.TL.hide.play(0);
  }

  var _onButtonClick = function() {
    this.show();
  }

  var _onProductClick = function(e) {

    var $li = $(e.currentTarget);
    var productID = $li.data('id');

    var links = this.pricesLink[productID];

    this.$fullBtn.attr('href', links.full);
    this.$halfBtn.attr('href', links.half);

    this.$products.removeClass('selected');
    $li.addClass('selected');

    if (!this.hasSelected) {
      this.hasSelected = true;

      TweenLite.to(this.$ctas[0], .3, {autoAlpha:1, y:0, ease:Cubic.easeOut});
      TweenLite.to(this.$ctas[1], .3, {autoAlpha:1, y:0, ease:Cubic.easeOut, delay:.1});

    }

  }

});

module.exports = BuyNowView;