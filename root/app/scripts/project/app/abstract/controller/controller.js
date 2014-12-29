'use strict';

var $         = require('jquery'),
    EVENT     = require('event/event'),
    _         = require('underscore'),
    Loader    = require('loader/loader'),
    Backbone  = require('backbone');

/**
 * AbstractPage: Defines a page (controller-like)
 *   Handles the loading + Model logic, binds to its view.
 * @extend {Backbone.Events}
 * @constructor
 */
var AbstractPage = function (){

  _.extend(this, Backbone.Events);

  /**
   * Instance of View
   * @type {abstract/View}
   */
  this.view = null;

  /**
   * Params object from router
   * @type {Objet}
   */
  this.params = {};

  /**
   * Id of the page 
   * @type {string}
   */
  this.id = "";

  /**
   * Instance of Loader
   * @type {loader/loader}
   */
  this.loader = null;

  /**
   * Is the content already loaded once ?
   * @type {Boolean}
   */
  this.isLoaded = false;

}



/**
 * Handles the init
 * @param {Object} params parameters for the page.
 * params.hasLoading: A page doesn't necessarily have to be loaded.
 */
AbstractPage.prototype.init = function(params) {

  this.params = params || {};

  this.instanceView();
  
  this.view.initConfig();

  if ((this.params.hasLoading === undefined || this.params.hasLoading) && !this.isLoaded) {
    this.initLoader();
  }
  
}

/**
 * Creates a new view instance
 */
AbstractPage.prototype.instanceView = function() {

}

/**
 * Inits the view
 * If we need something from the loader to give to the view
 *  it should be here
 */
AbstractPage.prototype.initView = function() {
  this.getCurrentAssets();

  this.view.init(this.params);
  //this.view.appendToContainer();
}

/**
 * Creates a Loader instance. Have to be overrided in case of special LoaderView
 */
AbstractPage.prototype.initLoader = function() {
  this.loader = new Loader();
  this.loader.init();
}

/**
 * Adds the assets to load
 */
AbstractPage.prototype.initAssets = function() {
  this.loader.addItems(this.view.configView.assets);
}

/**
 * Loading logic
 */
AbstractPage.prototype.load = function() {

  if (this.loader == null) return;

  this.initAssets();

  this.listenToOnce(this.loader, EVENT.SHOWN, $.proxy(this.loaderShown,this));
  this.listenToOnce(this.loader, EVENT.HIDDEN, $.proxy(this.loaderHidden,this));
  this.listenToOnce(this.loader, EVENT.COMPLETE, $.proxy(this.loaderComplete,this));

  this.loader.start();
}

/**
 * The loader view is shown
 */
AbstractPage.prototype.loaderShown = function() {
  this.trigger(EVENT.LOADER_SHOWN);
}

/**
 * The loader view is hidden
 */
AbstractPage.prototype.loaderHidden = function() {
  this.isLoaded = true;
  this.trigger(EVENT.LOADER_HIDDEN);
}

/**
 * The loading is complete
 */
AbstractPage.prototype.loaderComplete = function() { 
  this.trigger(EVENT.LOADER_COMPLETE);
}

/**
 * Format current assets into params from the loader depending of the current page ID
 */
AbstractPage.prototype.getCurrentAssets = function() {

  this.params.assets = {};

  if (this.loader == null) return;

  for(var i in this.loader.items) {
    var item = this.loader.items[i];

    // Has to be at the beginning
    if (item.id.indexOf(this.id + "_") === 0 ) {

      var currentId = this.id + "_";
      var id = item.id.substr(currentId.length); // we remove the first part

      this.params.assets[id] = item;
    }
  }
}

/**
 * Set params
 * @param {Object} params parameters for the page.
 */
AbstractPage.prototype.setParams = function(params) {
  this.params = params;
}

/**
 * Dispose the loader
 */
AbstractPage.prototype.disposeLoader = function() {
  if (this.loader != null) this.loader.dispose();
  this.loader = null;
}

/**
 * Dispose the page
 */
AbstractPage.prototype.dispose = function() {
  this.view.dispose();
  this.view = null;
}

module.exports = AbstractPage;