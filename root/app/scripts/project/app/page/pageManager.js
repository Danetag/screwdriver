'use strict';

var $                   = require('jquery'),
    Backbone            = require('backbone'),
    _                   = require('underscore'),
    EVENT               = require('event/event'),
    IndexPage           = require('page/pages/index/index'),
    AboutPage           = require('page/pages/about/about');

var PageManager = function (){

  _.extend(this, Backbone.Events);

  /*
   * Instance of Page
   * @type {Page}
   */
  this.currentPage  = null;

  /*
   * Instance of Page
   * @type {Page}
   */
  this.oldPage      = null;

  /*
   * object as an associative array
   * @type {Object}
   */
  this.pages        = {};

  /*
   * Current viewport
   * @type {Object}
   */
  this.viewport     = {};

}

PageManager.prototype.init = function() {

  _initPages.call(this);

}

PageManager.prototype.navigateTo = function(pageID) {

  console.log('PageManager:: navigateTo', pageID, 'currentPage:: ', this.currentPage.id);
  
  // If same page, resend params.
  if (this.currentPage !== null && this.currentPage.id === pageID) {
    console.log('same page, resend params if params.')
    //this.currentPage.setParams(params);
    return false;
  }

  // If the previous page still lives, so it could be a backslash during a loading. 
  // and the user requests a different page
  if (this.oldPage !== null) {
    
    if (this.currentPage.id !== pageID) {
      console.log('BACK !')
      Backbone.history.history.back();
    }

    return false;
  }

  this.setCurrentPage(pageID, params);

  // Starts here
  _hideOldPage.call(this);
  
}

PageManager.prototype.setCurrentPage = function(pageID, params) {
  this.oldPage = this.currentPage;
  this.currentPage = this.pages[pageID];
  this.currentPage.init(params);
}

PageManager.prototype.setOldPage = function(pageID) {
  this.oldPage = this.pages[pageID];
}

/**
 * Defines all the pages here
 * @private
 */
var _initPages = function() {

  this.pages = {
    'index': new IndexPage(),
    'about': new AboutPage()
  }

}

/** Transition logic */

/**
 * Hide the page currently displayed
 * @private
 */
var _hideOldPage = function() {
  this.listenToOnce(this.oldPage.view, EVENT.HIDDEN, _oldPageHidden.bind(this));
  this.oldPage.view.hide();
}

var _oldPageHidden = function() {
  _loadCurrentPage.call(this);
}

/**
 * Load the next page
 * @private
 */
var _loadCurrentPage = function() {

  if (!this.currentPage.isLoaded) {
    this.listenToOnce(this.currentPage, EVENT.LOADER_SHOWN, _currentPageLoaderShown.bind(this));
    this.listenToOnce(this.currentPage, EVENT.LOADER_COMPLETE, _currentPageLoaderComplete.bind(this));

    this.currentPage.load();
  } else {
    _currentPageLoaderShown.call(this);
    _currentPageLoaderComplete.call(this);
  }
  
}

/**
 * Once the loader is displayed, we can dispose the old view. (remove from DOM...)
 * @private
 */
var _currentPageLoaderShown = function() {
  console.log('_currentPageLoaderShown', this.oldPage);
  this.oldPage.dispose();
}

/**
 * Once the loader is complete, we init the view
 * @private
 */
var _currentPageLoaderComplete = function() {
  this.listenToOnce(this.currentPage.view, EVENT.INIT, _currentPageViewInit.bind(this));
  this.currentPage.initView();
}

/**
 * The current page is init, hide the loader
 * @private
 */
var _currentPageViewInit = function() {

  this.currentPage.view.resize(this.viewport);

  if (!this.currentPage.isLoaded) {
    this.listenToOnce(this.currentPage, EVENT.LOADER_HIDDEN, _currentPageLoaderHidden.bind(this));
    this.currentPage.loader.loaderView.hide();
  } else {
    _currentPageLoaderHidden.call(this);
  }

}

/**
 * The current loader is hidden, we can show the current view !
 * Dispose the current laoder as well
 * @private
 */
var _currentPageLoaderHidden = function() {
  this.listenToOnce(this.currentPage.view, EVENT.SHOWN, _currentPageViewShown.bind(this));

  this.currentPage.disposeLoader();
  this.currentPage.view.show();
}

/**
 * The current view is shown, mission complete
 * @private
 */
var _currentPageViewShown = function() {
  this.oldPage = null;
}

var _explore = function(){

  this.trigger(EVENT.EXPLORE, {});

}


module.exports = PageManager;