'use strict';

var $                 = require('jquery'),
    AbstractPageView  = require('abstract/page/pageView'),
    _                 = require('underscore'),
    PixiView          = require('page/main/views/slider/pixiView'),
    EVENT             = require('event/event'),
    Backbone          = require('backbone'),
    TitleTpl          = require('tpl/page/partial/title'),
    ButtonTpl         = require('tpl/page/partial/button_skip'),
    NavTpl            = require('tpl/carousel/navigation'),
    Tools             = require('tools/tools');

var SliderView = AbstractPageView.extend(new function (){

  this.idView = 'slider';
  this.id = "slider-container";

  /*
   * Pixy view
   * @type {pixi.View}
   */
  this.pixiView = null;

  this.titleTpl = _.template(TitleTpl);
  this.buttonTpl = _.template(ButtonTpl);
  this.navTpl = _.template(NavTpl);

  this.pixiViewShown = false;
  this.titleShown = false;
  this.isFirstTime = true;
  
  this.titleState = false;
  this.initialize = function(options) {
    this.pixiView = new PixiView(options);
    AbstractPageView.prototype.initialize.call(this, options);
  }

  this.subRenders = function() {

    var $header = $(this.titleTpl());

    this.$h2 = $header.find('h2');
    this.$title = this.$h2.find('.title');
    this.$subtitle = this.$h2.find('.subtitle');
    this.$option = this.$h2.find('.option');
    this.$tutorial = $header.find('h3');
    this.$button = $(this.buttonTpl());

    this.$nav = $(this.navTpl());
    this.$navLi = this.$nav.find('li');
    
    //TweenLite.set(this.$button, {autoAlpha: 0, y:20});

    this.canUpdate = true;
    
    this.pixiView.render();
    
    this.$el.append($header);
    this.$el.append(this.$button);
    this.$el.append(this.$nav);
    this.$el.append(this.pixiView.renderer.view);
    
  }

  this.bindEvents = function() {
    this.listenTo(this.pixiView, EVENT.CHANGE_TITLE, $.proxy(_onTitleChanged, this));
    this.listenTo(this.pixiView, EVENT.TOGGLE_MENU, $.proxy(_toggleMenu, this));
    this.listenTo(this.pixiView, EVENT.TOGGLE_TITLE, $.proxy(_toggleTitle, this));
    this.listenTo(this.pixiView, EVENT.INTERACTION_DONE, $.proxy(_goToContent, this));
    this.listenTo(this.pixiView, EVENT.INTERACTION_STARTED, $.proxy(_onInteractionStarted, this));

    this.$button.on('click', $.proxy(_goToContent, this));
    this.$navLi.on('click', $.proxy(_navigationSlider, this));
  }

  this.onResize = function(viewport) {
    this.pixiView.resize(viewport);
  }

  this.resize = function(viewport){
    this.onResize(viewport);

    this.viewport = viewport;

  }

  this.onMouseOut = function(outWindow) {
    this.pixiView.onMouseOut(outWindow);
  }

  this.show = function() {
    //this.listenToOnce(this.pixiView, EVENT.SHOWN, _pixiViewShown.bind(this));
    this.$nav.addClass('hover');
    setTimeout($.proxy(function(){
      this.$nav.removeClass('hover');
    },this), 2000);

    this.listenTo(this.pixiView, EVENT.SHOWN, _onSlideShown.bind(this));
    this.pixiView.show();
  }

  this.goToSection = function(sectionId, direct) {
    var d = direct || false;
    this.pixiView.goTo(sectionId, d);
  }

  this.toggleMenu = function() {
    this.$nav.toggleClass("hover");
    this.pixiView.toggleMenu();
  }


  this.onUpdate = function() {
    if (this.pixiView != null) this.pixiView.update();
  }

  /* Events */

  var _navigationSlider = function(e) {
    var $button = $(e.currentTarget);
    var direction = $button.data('direction');

    direction ==="rtl"? this.pixiView.currentIndex++ : this.pixiView.currentIndex--;

    if(this.pixiView.currentIndex<0) this.pixiView.currentIndex = 9;
    if(this.pixiView.currentIndex>9) this.pixiView.currentIndex = 0;

    this.pixiView.snapSlide();

    //console.log('$button', $button);
  } 

  var _toggleMenu = function(e){
    //this.$nav.toggleClass("hover");
    this.trigger(EVENT.TOGGLE_MENU, {});
  }

  var _onSlideShown = function(e) {

    var id = e.id;
    this.pixiViewShown = true;

    if (this.isFirstTime) {
      _isShown.call(this);
    } else {

      // If we change the section, assume that we go back to the homepage (so the current page is hidding)
      this.trigger(EVENT.GO_TO_CONTENT, {id: 'homepage'});
      _showSkipButton.call(this);

    }
  }

  var _toggleTitle = function(datas){
    this.titleState = !this.titleState;
    
    var scale = this.titleState ? .4 : 1;
    var alpha = this.titleState ? .7 : 1;

    var positionTop = -this.viewport.height/2;

    var titleY = this.titleState ? positionTop -100 : 0;
    var subtitleY = this.titleState ? positionTop -150 : 0;

    TweenLite.to(this.$title, .5, {scale: scale, y:titleY, autoAlpha : alpha, force3D: true, ease:Cubic.easeOut});
    TweenLite.to(this.$subtitle, .5, {scale: scale, y:subtitleY, autoAlpha : alpha,force3D: true, ease:Cubic.easeOut});
    TweenLite.to(this.$option, .5, {scale: scale, y:subtitleY, autoAlpha : alpha,force3D: true, ease:Cubic.easeOut});
      
    if(this.titleState) _displayTutorial.call(this);
    else _hideTutorial.call(this);
  }

  var _displayTutorial = function(){
    
    TweenLite.set(this.$tutorial, { y:50, autoAlpha : 0, force3D: true});
    TweenLite.to(this.$tutorial, 2, { y:0, autoAlpha : 1, force3D: true, ease : Power2.easeOut,delay:.5});
    TweenLite.to(this.$tutorial, 2, { y:-100, autoAlpha : 0, force3D: true, ease : Power2.easeIn,delay:5});
    
  }

  var _hideTutorial = function () {

    TweenLite.to(this.$tutorial, .3, { y:-100, autoAlpha : 0, force3D: true, ease : Power2.easeIn});

  }

  var _onTitleChanged = function(e) {

    if (!this.pixiView.getCurrentSlide().hasBeenShownOnce) _hideSkipButton.call(this);

    var spansTitle = Tools.create_letter_span(e.title);
    
    this.$title.html(spansTitle);
    this.$tutorial.html(e.tutorial);
    //this.$tutorial.html(e.tutorial);

    _showTitle.call(this, this.$title, e.direct);

    if (e.subtitle != undefined) 
    {
      var spansOption = Tools.create_letter_span(e.subtitle);
      this.$option.html(spansOption);
      _showTitle.call(this, this.$option, e.direct, false);
    } else {
      this.$option.empty();
    }
    
  }

  var _showTitle = function($el, direct, hasCallback) {

    var $letters = $el.find('span.letter');
    var hc = (hasCallback != undefined) ? hasCallback : true;

    var length = $letters.length;
    var delay = 0;

    var o = {
        y:0,
        rotationX: "0deg",
        autoAlpha: 1,
        ease: Power1.easeIn,
        force3D:true
    }

    if (hc) o.onComplete = _onTitleShown.bind(this);

    TweenMax.staggerTo($letters, direct ? 0 :.3, o , .025);

  }

  var _showSkipButton = function() {
    //TweenLite.to(this.$button, .5, {autoAlpha: 1, y:0, ease:Cubic.easeOut})
    this.$button.addClass('show');
  }

  var _hideSkipButton = function() {
    //TweenLite.to(this.$button, .5, {autoAlpha: 0, y:20, ease:Cubic.easeOut})
    this.$button.removeClass('show');
  }

  var _onInteractionStarted = function() {
    _hideSkipButton.call(this);

    setTimeout($.proxy(function(){
      _showSkipButton.call(this);
    }, this), 4000);
  }

  var _onTitleShown = function() {
    this.titleShown = true;
    _isShown.call(this);
  }

  var _isShown = function() {
    if (!this.titleShown || !this.pixiViewShown || !this.isFirstTime) return;

    this.isFirstTime = false;
    _showSkipButton.call(this);

    this.trigger(EVENT.SHOWN);
  }

  var _goToContent = function(e) {

    console.log('_goToContent >> this.pixiView.currentInteraction', this.pixiView.currentInteraction);

    //if there is interaction we hide and apply delay before displaying the content
    if (this.pixiView.currentInteraction != null){
      this.pixiView.currentInteraction.hide();

      setTimeout($.proxy(function(){
        var id = this.pixiView.getCurrentSlide().id;
        console.log('id', id);
        this.trigger(EVENT.GO_TO_CONTENT, {id: id});
      }, this), 1200);

    }else{
      var id = this.pixiView.getCurrentSlide().id;
      console.log('id', id);
      this.trigger(EVENT.GO_TO_CONTENT, {id: id});
    }
    
  }


});

module.exports = SliderView;