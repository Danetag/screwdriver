'use strict';

var Loader         				= require('loader/loader'),
    EVENT         				= require('event/event'),
    LoaderViewCarousel    = require('loader/views/carousel'),
    Config                = require('config/config'),
    CarouselView          = require('abstract/component/carousel/views/carouselView');
    

var Carousel = function (items_){

  _.extend(this, Backbone.Events);

  /**
   * Instance of Loader
   * @type {loader/loader}
   */
  this.loader = null;

  /**
   * Array of items to load
   * @type {Array}
   */
  this.items = items_;

  /**
   * Instance of View
   * @type {abstract/View}
   */
  this.view = null;


  /**
   * Is loaded?
   * @type {Boolean}
   */
  this.isLoaded = false;

  
}


Carousel.prototype.init = function() {
  this.initLoader();
  this.load();
}


Carousel.prototype.initLoader = function() {
	this.loader = new Loader();
  this.loader.init(new LoaderViewCarousel());
}


/**
 * Adds the assets to load
 */
Carousel.prototype.initAssets = function() {
  this.loader.addItems(this.items);
}


Carousel.prototype.show = function() {

	if (!this.isLoaded) 
		this.init();
	else
		this.display();

};


/**
 * Hide the Carousel
 */
Carousel.prototype.hide = function() {
  this.listenToOnce(this.view, EVENT.HIDDEN, this.viewHidden.bind(this));
  this.view.hide();
}


/**
 * Current Carousel hidden
 */
Carousel.prototype.viewHidden = function() {
  this.trigger(EVENT.HIDDEN);
  this.disposeView();
}


/**
 * Loading logic
 */
Carousel.prototype.load = function() {

  this.initAssets();

  this.listenToOnce(this.loader, EVENT.SHOWN, $.proxy(this.loaderShown,this));
  this.listenToOnce(this.loader, EVENT.HIDDEN, $.proxy(this.loaderHidden,this));
  this.listenToOnce(this.loader, EVENT.COMPLETE, $.proxy(this.loaderComplete,this));

  this.loader.start();
}


/**
 * The loader view is shown
 */
Carousel.prototype.loaderShown = function() {
  this.trigger(EVENT.LOADER_SHOWN);
}


/**
 * The loader view is hidden
 */
Carousel.prototype.loaderHidden = function() {
  this.loader.dispose();
  this.loader = null;
}


/**
 * The loading is complete
 */
Carousel.prototype.loaderComplete = function() {
	this.isLoaded = true;
  this.display();
}


Carousel.prototype.display = function() {

	this.instanceView();

  this.listenToOnce(this.view, EVENT.INIT, this.viewInit.bind(this));
  this.listenToOnce(this.view, EVENT.CLOSE, this.hide.bind(this));

  this.view.init({$container: $('body')});

}


Carousel.prototype.instanceView = function() {
  this.view = new CarouselView({}, {items:this.items} );
}


Carousel.prototype.viewInit = function() {

  this.trigger(EVENT.INIT);

  this.listenToOnce(this.view, EVENT.SHOWN, this.viewShown.bind(this));
  this.view.show();
}


/**
 * Current view shown
 */
Carousel.prototype.viewShown = function() {
  this.trigger(EVENT.SHOWN);

  if (this.loader != null)
  	this.loader.hide();
}

/**
 * disposeView
 */
Carousel.prototype.disposeView = function() {

	if (this.view != null) 
		this.view.dispose();

  this.view = null;
}


/**
 * Current Carousel hidden
 */
Carousel.prototype.dispose = function() {
  this.disposeView();
  this.loader = null;
}


module.exports = Carousel; 