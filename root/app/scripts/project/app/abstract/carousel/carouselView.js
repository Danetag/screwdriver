'use strict';

var $                 = require('jquery'),
    EVENT             = require('event/event'),
    _                 = require('underscore'),
    CAROUSEL_EVENT    = require('abstract/carousel/carouselEvent'),
    AbstractView      = require('abstract/view'),
    CarouselNav       = require('abstract/carousel/carouselNavView'),
    CarouselItemView  = require('abstract/carousel/carouselItemView'),

    CarouselMulticamView          = require('page/pages/shelter/views/carousel/carouselMulticamView'),
    CarouselFoodView              = require('page/pages/food/views/carousel/carouselFoodView'),
    CarouselMonocularView         = require('page/pages/illumination/views/carousel/carouselMonocularView'),
    CarouselSurefireView          = require('page/pages/illumination/views/carousel/carouselSurefireView'),
    CarouselSurefireVampireView   = require('page/pages/illumination/views/carousel/carouselSurefireVampireView'),
    CarouselFirstaidView          = require('page/pages/medical/views/carousel/CarouselFirstaidView'),

    Backbone          = require('backbone');

var AbstractCarouselView = AbstractView.extend(new function (){

  this.events = {
    "touchstart": "touchStart",
    "touchmove": "touchMove",
    "touchend": "touchEnd",
  }

  this.customViews = {
    "CarouselMulticamView" : CarouselMulticamView,
    "CarouselFoodView" : CarouselFoodView,
    "CarouselSurefireVampireView" : CarouselSurefireVampireView,
    "CarouselSurefireView" : CarouselSurefireView,
    "CarouselMonocularView" : CarouselMonocularView,
    "CarouselFirstaidView" : CarouselFirstaidView
  }

  /**
   * Resize breakpoint
   * @type {Number}
   * @private
   */
  this.refWidth = 1280;

  /**
   * Resize breakpoint
   * @type {Number}
   * @private
   */
  this.refHeightCarousel = 960;

  this.refFonts = {
    base:16,
    subtitle:18.5,
    title:35,
    paragraphe:16
  }


  this.initialize = function(options) {

    /**
     * Element containing all the carousel
     * @type {$element}
     * @private
     */
    this.$el = options.carousel;

    /**
     * The carousel section
     * @type {$element}
     * @private
     */
    this.$carouselSection = this.$el.parent();

    /**
     * Element containing Items elements. (ul)
     * @type {$element}
     * @private
     */
    this.$carouselContainer = this.$el.find('.carousel-container');

    /**
     * Item elements.
     * @type {$element}
     * @private
     */
    this.$carouselItems = this.$carouselContainer.find('.carousel-item');

    /**
     * Current index
     * @type {number}
     * @private
     */
    this.currentIdx = 0;

    /**
     * prevent when translating
     * @type {boolean}
     * @private
     */
    this.isTranslating = false;

    /**
     * Width of the carousel
     * @type {number}
     * @private
     */
    this.widthCarousel = 0;

    /**
     * Next index
     * @type {number}
     * @private
     */
    this.nextIdx = 0;

    /**
     * Current X
     * @type {number}
     * @private
     */
    this.x = 0;

    /**
     * Current touch object
     * @type {Object}
     * @private
     */
    this.touch = {
      x: 0,
      y: 0,
      isDown: true,
      startX:0,
      deltaX: 0
    };

    /**
     * Can swipe
     * @type {boolean}
     * @private
     */
    this.canSwipe = false;

    /**
     * First test on mouse move to prevent scrolling
     * @type {boolean}
     * @private
     */
    this.firstTouchTest = true;

    /**
     * Navigation
     * @type {abstract/carousel/carouselNavView}
     * @private
     */
    this.carouselNav = null;

    /**
     * Navigation
     * @type {array of abstract/carousel/carouselItemView}
     * @private
     */
    this.aItemsView = [];

    

    this.percentPositionInit = false;

    this.init();
    AbstractView.prototype.initialize.call(this, options);
  }

  this.render = function() {
    this.el = this.$el[0];
    if (this.carouselNav != null) this.$el.append(this.carouselNav.$el);
  }

  this.init = function() {

    _initItems.call(this);

    if (this.$carouselItems.length > 1) {
      this.carouselNav = new CarouselNav();
      this.bindEvents();
    }

    
  }

  this.bindEvents = function() {

    this.listenTo(this.carouselNav, CAROUSEL_EVENT.NAVIGATION, $.proxy(_navigate, this));

    document.addEventListener('touchmove', $.proxy(function(e){ 

      if (this.canSwipe) {
        e.preventDefault(); 
      }
        
    }, this), false);

    // Only for touch screen
    if (Modernizr.touch) 
      this.canUpdate = true;

  }

  this.unbindEvents = function() {
    this.stopListening(this.carouselNav);
    document.removeEventListener('touchmove');

    this.canSwipe = false;
    this.canUpdate = false;
  }

  this.show = function() {

    if (this.carouselNav != null) this.carouselNav.show();

    var currentItem = this.aItemsView[0];
    if (this.aItemsView.length > 1)
      currentItem = this.aItemsView[1];

    currentItem.show();

    AbstractView.prototype.show.call(this);
  }

  this.hide = function() {
    AbstractView.prototype.hide.call(this);
  }

  this.dispose = function() {
    if (this.carouselNav != null) this.carouselNav.dispose();
    AbstractView.prototype.dispose.call(this);

    this.carouselNav = null;
    this.remove();
  }


  /**
   * Resize the carousel. Update the width of the container/items
   */
  this.onResize = function() {

    this.canSwipe = false;

    this.widthCarousel = this.viewport.width;

    // Set width for the carousel.
    var widthCarousel = parseInt(this.widthCarousel * this.$carouselItems.length * 1.1); // 1.1 = marge
    TweenLite.set(this.$carouselContainer, {width: widthCarousel});

    // Set the width of each items
    TweenLite.set(this.$carouselItems, {width: this.widthCarousel, force3D: true});

    // Put it here first

    if (this.$carouselItems.length > 1) {
      this.x = -this.widthCarousel;

      // Reset style.
      TweenLite.set(this.$carouselContainer, {x: this.x});
    }


  };

  /**
   * Callback on Touch start event. Save mouse x/y
   * @param {event} e Event.
   * @return {boolean} false if is animating
   */
  this.touchStart = function(e) {

    if (this.isTranslating) {
      return false;
    }
    
    this.canSwipe = this.firstTouchTest = this.touch.isDown = true;

    this.touch.deltaX = 0;
    this.touch.x = this.touch.startX = e.originalEvent.touches[0].pageX;
    this.touch.y = this.touch.startY = e.originalEvent.touches[0].pageY;

  }


  /**
   * Callback on Touch move event. Save the delta between current mouse x/y and start mouse x/y
   * @param {event} e Event.
   * @return {boolean} false if is animating
   */
  this.touchMove = function(e) {
    
    if (this.isTranslating || !this.canSwipe) {
      return false;
    }

    var pageX = e.originalEvent.touches[0].pageX;
    var pageY = e.originalEvent.touches[0].pageY;

    if (this.firstTouchTest) {

      this.firstTouchTest = false;

      var deltaX = Math.abs(this.touch.x - pageX);
      var deltaY = Math.abs(this.touch.y - pageY);

      // We want to scroll, to to use the carousel
      // 10 = marge
      if (deltaY >= deltaX - 10) {
        this.canSwipe = false; // stop the update, go for scroll
      } else {
        this.touch.deltaX = (this.touch.startX - pageX);
        this.touch.startX = pageX;
      }

    } else {
      this.touch.deltaX = (this.touch.startX - pageX);
      this.touch.startX = pageX;
    }
    
  }

  this.touchEnd = function(e) {

    if (this.isTranslating) {
      return false;
    }

    this.touch.isDown = false;
    this.firstTouchTest = true;

  }

  /**
   * Handles initialization of Items.
   * Recreate slide by cloning the original ones, for swiping on mobile
   * @private
   */
  var _initItems = function() {

    _cloneItems.call(this);

    if (this.$carouselItems.length > 1) {

      // Take the last item and put it right before the first one.
      // So we can swipe left/right.
      if (this.currentIdx === 0) {
        var $firstItem = $(this.$carouselItems[0]);
        var $lastItem = $(this.$carouselItems[this.$carouselItems.length - 1]);

        $lastItem.insertBefore($firstItem);
      }

    }

    _createItemsView.call(this);

  }

  var _cloneItems = function() {

    if (this.$carouselItems.length > 1) {

      var itemStr = "";

      //console.log('this.$carouselItems', this.$carouselItems.length);

      $.each(this.$carouselItems, $.proxy(function(i, item){

        var $elm = $(item).clone(true);
        $elm.addClass('clone');

        var id = parseInt($elm.data('id').replace('item-', ''), 10) + this.$carouselItems.length;
        id = (id < 10) ? '0' + id : id;
        
        $elm.attr('data-id', 'item-' + id);

        itemStr += $elm[0].outerHTML;

      }, this));

      this.$carouselContainer.append(itemStr);

    }

    // Update
    this.$carouselItems = this.$carouselContainer.find('.carousel-item');

  }

  var _createItemsView = function() {

    this.$carouselItems = this.$carouselContainer.find('.carousel-item');

    $.each(this.$carouselItems, $.proxy(function(i, item){

      var $li = $(item);
      var itemView = null;

      if ($li.data("custom-view") != undefined) itemView = new this.customViews[$li.data("custom-view")]({carouselItem: $li});
      else itemView = new CarouselItemView({carouselItem: $li});

      this.aItemsView.push(itemView);

      //bind
      this.listenTo(itemView, EVENT.SHOWN, $.proxy(_onSlideShown, this));
      this.listenTo(itemView, EVENT.HIDDEN, $.proxy(_onSlideHidden, this));
      
    }, this))

  }

  var _onSlideShown = function() {
    this.isTranslating = false;
  }

  var _onSlideHidden = function() {
    
  }


  /**
   * Sort the items in the DOM
   * @private
   */
  var _sortItemElmt = function(rtl) {

    var $lastItem = this.aItemsView[this.aItemsView.length - 1].$el;
    var $firstItem = this.aItemsView[0].$el;

    if(rtl) {
      // went right. Move the first one to the end 
      $firstItem.insertAfter($lastItem);
      this.aItemsView.push(this.aItemsView.shift());

    } else {
      // went left. Move the last one to the first position
      $lastItem.insertBefore($firstItem);

      var last = this.aItemsView.splice(-1, 1)[0];
      this.aItemsView.splice(0, 0, last );
    }

  };

  this.onUpdate = function() {

    if (this.canSwipe) {

      if (this.touch.isDown) {
        this.touch.deltaX *= .97;

        if (Math.abs(this.touch.deltaX) < 0.1) this.touch.deltaX = 0;
       
        this.x -= this.touch.deltaX;

        TweenLite.set(this.$carouselContainer, {x: this.x});
      } else {
        //snap
        this.canSwipe = false;

        var rtl = true;

        if (this.x > -this.widthCarousel)  rtl = false;
        if (this.x != -this.widthCarousel)  _translateTo.call(this, null, rtl);
      }
      
    }

  }


  var _navigate = function(e) {
    var rtl = (e.direction == 'rtl') ? true : false;

    _translateTo.call(this, null, rtl);
  }

  /**
   * Go to the index-th tab.
   * @param {number} index Index of the tab to go to.
   * @param {boolean} rtl Direction (false == left to right).
   * @return {boolean} false if is animating
   */
  var _translateTo = function(index, rtl) {

    if (this.isTranslating) {
      return false;
    }

    this.isTranslating = true;

    var rightToLeft = (rtl != undefined) ? rtl : true;
    var add = 1;

    // Only if you click on the left button
    if ( index != null && ((index < this.currentIdx) || (index == this.$carouselItems.length - 1 && this.currentIdx == 0))) {
      rightToLeft = false;
    }

    if (this.currentIdx == this.$carouselItems.length - 1 && index == 0) {
      rightToLeft = true;
    }

    if (!rightToLeft) {
      add = -1;
    }

    this.nextIndex = (index != null) ? index : this.currentIdx + add;

    if (this.nextIndex >= this.$carouselItems.length) {
      this.nextIndex = 0;
    }

    if (this.nextIndex < 0) {
      this.nextIndex = this.$carouselItems.length - 1;
    }

    var nextX = -this.widthCarousel * 2;

    if (!rightToLeft) {
      nextX = 0;
    }

    this.aItemsView[1].hide();

    _.defer($.proxy(function(){
      TweenLite.to(this.$carouselContainer, .5, { x:nextX, ease: Cubic.easeOut, force3D: true, onCompleteParams:[{rtl:rtl}], onComplete:_onTranslateComplete.bind(this)})
    }, this));
    

  };

  var _onTranslateComplete = function(o) {
    
    var rtl = o.rtl;

    this.currentIdx = this.nextIndex;

    _sortItemElmt.call(this, o.rtl);

    // Put it here first
    this.x = -this.widthCarousel;

    // Reset style.
    TweenLite.set(this.$carouselContainer, {x: this.x, force3D: true});

    this.aItemsView[1].show();

  }


});


module.exports = AbstractCarouselView;