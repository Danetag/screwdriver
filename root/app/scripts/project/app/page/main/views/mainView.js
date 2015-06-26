'use strict';


var AbstractDOMView         = require('abstract/view/DOM/DOMView'),
    MenuView                = require('page/main/views/menu/menuView'),
    //BtnMenuView             = require('page/main/views/menu/btnMenuView'),
    EVENT                   = require('event/event'),
    Config                  = require('config/config'),
    CV                      = require('config/currentValues'),
    Analytics               = require('app/tools/analytics');


/**
 * MainView: Handles the main view logic - window/document event
 * @extend {abstract/view/DOM/DOMview}
 * @constructor
 */
var MainView = function (options, datas){

  this.el     = document.body;
  this.idView = 'mainpage';

  /*
   * Instance of Menu View
   * @type {page/main/views/menu/menuView}
   */
  this.menuView = null;

  /*
   * Instance of Btn Menu View
   * @type {page/main/views/menu/btnMenuView}
   */
  this.btnMenuView = null;

  /**
   * Meta viewport element
   * @type {element}
   * @private
   */
  this.metaViewport = null;

  /**
   * Main container
   * @type {jQuery element}
   * @private
   */
  this.$container = null;

  /**
   * html element
   * @type {jQuery element}
   * @private
   */
  this.$html = null;

  /**
   * body element
   * @type {jQuery element}
   * @private
   */
  this.$body = null;

  /**
   * block the mouse event from anywhere
   * @type {boolean}
   */
  this.blockMouseEvent = false;

  /**
   * Usefull for touchMove: should we block the scroll or not?
   * @type {boolean}
   */
  this.canMove = true;

  /**
   * Usefull for touchMove: should we block the scroll or not?
   * @type {boolean}
   */
  this.itsSettled = false;

  /**
   * Analytic Class
   * @type {Tools/Analytics}
   */
  this.analytics = null;

  /**
   * scroll Y value
   * @type {number}
   */
  this.scrollY = 0;


  AbstractDOMView.call(this, options, datas);

};

_.extend(MainView, AbstractDOMView);
_.extend(MainView.prototype, AbstractDOMView.prototype);


/**
 * @override
 */
MainView.prototype.initDOM = function() {

  this.metaViewport = document.querySelector('meta[name=viewport]');
  this.analytics = new Analytics();

}


/**
 * @override
 */
MainView.prototype.initSubViews = function() {

  
  this.menuView = new MenuView({el: $("#menu")});
  this.menuView.init();

  /*
  this.btnMenuView = new BtnMenuView();
  this.btnMenuView.init({$container: this.$el, prepend:true});
  */

  // Destroy assets references
  this.assets = null;
}


/**
 * @override
 */
MainView.prototype.bindEvents = function() {
  /*
  this.listenTo(this.btnMenuView, EVENT.TOGGLE_MENU, $.proxy(_toggleMenu, this));
  this.listenTo(this.btnMenuView, EVENT.TOGGLE_SUB_MENU, $.proxy(_toggleSubMenu, this));
  this.listenTo(this.menuView, EVENT.TOGGLE_MENU, $.proxy(_toggleMenu, this));
  this.listenTo(this.menuView, EVENT.TOGGLE_SUB_MENU, $.proxy(_toggleSubMenu, this));
  */
  
  this.canUpdate = true;
}

/**
 * Give a class to the container to have an overflow:hidden and no scroll
 */
MainView.prototype.noContent = function(noContent_) {

  var noContent = (noContent_ != undefined) ? noContent_ : true;

  setTimeout($.proxy(function(){

    if (noContent)
      this.$container.addClass('no-content');
    else 
      this.$container.removeClass('no-content');


  }, this), 0);

} 


/**
 * Bind all the main window/document event here.
 */
MainView.prototype.bindMainEvents = function() {

  this.$html = $('html');
  this.$container = $('#content');
  this.$body = $('body');

  window.addEventListener('scroll', $.proxy(_onScroll, this), false);
  window.requestAnimationFrame(_onRAF.bind(this));

  if("onorientationchange" in window && !"resize" in window) {
    console.log('orientation change event !');
    //window.removeEventListener("resize",  $.proxy(_onResize, this), false);
    window.addEventListener("orientationchange", $.proxy(_onOrientationChange, this), false);
  } else {
    window.addEventListener("resize",  $.proxy(_onResize, this), false);
  }

  document.addEventListener("mouseout",  $.proxy(_onMouseOut, this), false);

  this.$body[0].addEventListener("mousemove",  $.proxy(_onMouseMove, this), false);
  this.$body[0].addEventListener("mousedown",  $.proxy(_onMouseDown, this), false);
  this.$body[0].addEventListener("mouseup",  $.proxy(_onMouseUp, this), false);

  this.$body[0].addEventListener("touchstart",  $.proxy(_onTouchStart, this), false);
  this.$body[0].addEventListener("touchmove",  $.proxy(_onTouchMove, this), false);
  this.$body[0].addEventListener("touchend",  $.proxy(_onTouchEnd, this), false);

}


/**
 * @override
 */
MainView.prototype.show = function() {
  this.$el.addClass('show');
  AbstractDOMView.prototype.show.call(this);
}


MainView.prototype.showSubviews = function() {
  this.$el.addClass('show-subviews');
}

MainView.prototype.hideSubviews = function() {
  this.$el.removeClass('show-subviews');
}


/**
 * @override
 */
MainView.prototype.onResize = function() {

  if (!this.isInit) return;

}

/**
 * @override
 */
MainView.prototype.onUpdate = function() {

}

/**
 * @override
 */
MainView.prototype.onScroll = function() {
  
}


MainView.prototype.onMouseMove = function() {

}


MainView.prototype.onMouseDown = function() {

}


MainView.prototype.onMouseUp = function() {

}


MainView.prototype.onMouseOut = function(outWindow_) {

}

/**
 * @override
 */
MainView.prototype.onOrientationChange = function() {

}



/**
 * Clear current content
 */
MainView.prototype.cleanCurrentContent = function() {

  if (this.$container == null)
    this.$container = $('#content');

  this.$container.empty();
}



MainView.prototype.forceResize = function() {
  _onResize.call(this);
}

/*
 * @override
 * Do nothing here.
 */
MainView.prototype.dispose = function() {}




/**
 * On Orientation change
 */
var _onOrientationChange = function() {
  _onResize.call(this);
}

/**
 * On Orientation change
 */
var _onScroll = function(e) {

  this.scrollY = window.scrollY || window.pageYOffset;

  this.onScroll();
  this.trigger(EVENT.ON_SCROLL);
}


var _onResize = function() {

  CV.viewport.width = $(document).width()
  CV.viewport.height = $(window).height();

  console.log('MainResize:CV', CV.viewport);

  this.resize();
  this.trigger(EVENT.ON_RESIZE);

};


/**
 * On request animation frame
 */
var _onRAF = function() {
  this.update();
  this.trigger(EVENT.ON_RAF);

  window.requestAnimationFrame(_onRAF.bind(this));
}


/**
 * On Mouse out
 */
var _onMouseOut = function(e) {
  var from = e.relatedTarget || e.toElement;
  CV.outWindow = false;

  if (!from || from.nodeName == "HTML") CV.outWindow = true;

  this.onMouseOut();
  this.trigger(EVENT.ON_MOUSE_OUT);
}



var _onTouchStart = function(e) {

  CV.mouse.x = e.touches[0].clientX;
  CV.mouse.y = e.touches[0].clientY;

  this.onMouseDown();
  this.trigger(EVENT.ON_MOUSE_DOWN);
}


var _onMouseDown = function(e) {

  e.preventDefault();

  CV.mouse.x = e.clientX || e.pageX;
  CV.mouse.y = e.clientY || e.pageY;

  this.onMouseDown();
  this.trigger(EVENT.ON_MOUSE_DOWN);
}

var _onTouchMove = function(e) {

  CV.mouse.x = e.touches[0].clientX;
  CV.mouse.y = e.touches[0].clientY;

  this.onMouseMove();
  this.trigger(EVENT.ON_MOUSE_MOVE);

}


var _onMouseMove = function(e) {

  e.preventDefault();

  CV.mouse.x = e.clientX || e.pageX;
  CV.mouse.y = e.clientY || e.pageY;

  this.onMouseMove();
  this.trigger(EVENT.ON_MOUSE_MOVE);
}



var _onTouchEnd = function(e) {

  this.itsSettled = false;

  this.onMouseUp();
  this.trigger(EVENT.ON_MOUSE_UP);
}

var _onMouseUp = function(e) {

  e.preventDefault();

  CV.mouse.x = e.clientX || e.pageX;
  CV.mouse.y = e.clientY || e.pageY;

  this.onMouseUp();
  this.trigger(EVENT.ON_MOUSE_UP);
}



module.exports = MainView;