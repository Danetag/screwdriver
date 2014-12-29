'use strict';

var $                   = require('jquery'),
    Backbone            = require('backbone'),
    _                   = require('underscore'),
    EVENT               = require('event/event'),
    IndexPage           = require('page/pages/index/index'),
    AboutPage           = require('page/pages/about/about');



/**
 * PageManager: manage the page transitions
 * @extend {Backbone.Events}
 * @constructor
 */
var PageManager = function (){

  _.extend(this, Backbone.Events);

  /*
   * Instance of Page
   * @type {abstract/controller}
   */
  this.currentPage  = null;

  /*
   * Instance of Page
   * @type {abstract/controller}
   */
  this.oldPage      = null;

  /*
   * object as an associative array
   * @type {Object}
   */
  this.pages        = {};

}


/*
 * Handles the initialization
 */
PageManager.prototype.init = function() {
  _initPages.call(this);
}


/*
 * Entry point to change pages
 * @param {string} pageID of the page to navigate to.
 * @param {Object} params of the page to navigate to.
 */
PageManager.prototype.navigateTo = function(pageID, params) {

  //console.log('PageManager:: navigateTo', pageID, 'currentPage:: ', this.currentPage.id);
  
  // If same page, resend params.
  if (this.currentPage !== null && this.currentPage.id === pageID) {
    console.log('same page, resend params if params.')
    this.currentPage.setParams(params);
    return;
  }

  // If the previous page still lives, so it could be a backslash during a loading. 
  // and the user requests a different page
  if (this.oldPage !== null) {
    
    if (this.currentPage.id !== pageID) {
      console.log('BACK !')
      Backbone.history.history.back();
    }

    return;
  }

  this.setCurrentPage(pageID, params);

  // Starts here
  _hideOldPage.call(this);
  
}


/*
 * Set the current page
 * @param {string} pageID of the page to navigate to.
 * @param {Object} params of the page to navigate to.
 */
PageManager.prototype.setCurrentPage = function(pageID, params) {

  if (this.pages[pageID] == undefined) {
    console.log('PageManager:: Error: Please create a controller/view for the ' + pageID + 'section, then register the page in the PageManager');
    return;
  }

  this.oldPage = this.currentPage;
  this.currentPage = this.pages[pageID];
  this.currentPage.init(params);
}


/**
 * Hide the page currently displayed
 * @private
 */
PageManager.prototype.setOldPage = function(pageID) {
  this.oldPage = this.pages[pageID];
}


/**
 * Instance all the pages here
 * @private
 */
var _initPages = function() {

  this.pages = {
    'index': new IndexPage(),
    'about': new AboutPage()
  }

}

/** Transition logic **/

/**
 * Hide the page currently displayed
 * @private
 */
var _hideOldPage = function() {
  this.listenToOnce(this.oldPage.view, EVENT.HIDDEN, _oldPageHidden.bind(this));
  this.oldPage.view.hide();
}


/**
 * Callback once the current page is hidden
 * @private
 */
var _oldPageHidden = function() {
  _loadCurrentPage.call(this);
}


/**
 * Load the next page
 * If already loaded, no loader is displayed, we directly go to the next step
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


module.exports = PageManager;