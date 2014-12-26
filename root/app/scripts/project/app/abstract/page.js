'use strict';

var $         = require('jquery'),
    EVENT     = require('event/event'),
    _         = require('underscore'),
    Loader    = require('loader/loader'),
    Backbone  = require('backbone');

var AbstractPage = function (){

  _.extend(this, Backbone.Events);

  /*
   * Instance of View
   * @type {View}
   */
  this.view = null;

  /*
   * Params object from router
   * @type {Objet}
   */
  this.params = {};

  /*
   * Id of the page 
   * @type {string}
   */
  this.id = "";

  /*
   * Instance of loader/loader
   * @type {Loader}
   */
  this.loader = null;

  /*
   * Is the content already loaded once ?
   * @type {Boolean}
   */
  this.isLoaded = false;

}


AbstractPage.prototype.init = function(params) {

  this.params = params || {};

  this.instanceView();
  
  this.view.initConfig();

  if ((this.params.hasLoading === undefined || this.params.hasLoading) && !this.isLoaded) {
    this.initLoader();
  }
  
}

/*
 * Instance the view here
 */
AbstractPage.prototype.instanceView = function() {

}

/*
 * If we need something from the loader to give to the view
 * it should be here
 */
AbstractPage.prototype.initView = function() {
  this.getCurrentAssets();

  this.view.init(this.params);
  this.view.appendToContainer();
}

AbstractPage.prototype.load = function() {

  if (this.loader == null) return;

  this.initAssets();

  this.listenToOnce(this.loader, EVENT.SHOWN, $.proxy(this.loaderShown,this));
  this.listenToOnce(this.loader, EVENT.HIDDEN, $.proxy(this.loaderHidden,this));
  this.listenToOnce(this.loader, EVENT.COMPLETE, $.proxy(this.loaderComplete,this));

  this.loader.start();
}

AbstractPage.prototype.loaderShown = function() {
  this.trigger(EVENT.LOADER_SHOWN);
}

AbstractPage.prototype.loaderHidden = function() {
  this.isLoaded = true;
  this.trigger(EVENT.LOADER_HIDDEN);
}

AbstractPage.prototype.loaderComplete = function() { 
  this.trigger(EVENT.LOADER_COMPLETE);
}

/*
 * Format current assets into params from the loader depending of the current page ID
 * @type {boolean}
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

AbstractPage.prototype.setParams = function(params) {
  this.params = params;
}

AbstractPage.prototype.disposeLoader = function() {
  if (this.loader != null) this.loader.dispose();
  this.loader = null;
}

AbstractPage.prototype.dispose = function() {
  this.view.dispose();
  this.view = null;
}

/* To override */

/*
 * Define your Loader here. Can be overrided in case of special LoaderView
 */
AbstractPage.prototype.initLoader = function() {
  this.loader = new Loader();
  this.loader.init();
}

/*
 * Define your assets to load here
 */
AbstractPage.prototype.initAssets = function() {
  this.loader.addItems(this.view.configView.assets);
}



module.exports = AbstractPage;