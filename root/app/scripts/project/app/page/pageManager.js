'use strict';

var $                   = require('jquery'),
    Backbone            = require('backbone'),
    _                   = require('underscore'),
    EVENT               = require('event/event'),
    HomePage            = require('page/pages/home/homepage'),
    StartPage           = require('page/pages/start/startpage'),
    CommunicationPage   = require('page/pages/communication/communicationpage'),
    NavigationPage      = require('page/pages/navigation/navigationpage'),
    HydrationPage       = require('page/pages/hydration/hydrationpage'),
    FoodPage            = require('page/pages/food/foodpage'),
    ToolsPage           = require('page/pages/tools/toolspage'),
    MedicalPage         = require('page/pages/medical/medicalpage'),
    ShelterPage         = require('page/pages/shelter/shelterpage'),
    IlluminationPage    = require('page/pages/illumination/illuminationpage'),
    PetPage             = require('page/pages/pet/petpage');

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

PageManager.prototype.navigateTo = function(pageID, params) {

  console.log('PageManager:: navigateTo', pageID, 'currentPage:: ', this.currentPage.id);
  
  // If same page, resend params.
  if (this.currentPage !== null && this.currentPage.id === pageID) {
    console.log('same page, resend params.')
    this.currentPage.setParams(params);
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

  this.listenTo(this.currentPage.view, EVENT.EXPLORE, _explore.bind(this));
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
    'homepage': new HomePage(),
    'start': new StartPage(),
    'communication': new CommunicationPage(),
    'pet': new PetPage(),
    'navigation': new NavigationPage(),
    'hydration': new HydrationPage(),
    'food': new FoodPage(),
    'tools': new ToolsPage(),
    'medical': new MedicalPage(),
    'shelter': new ShelterPage(),
    'illumination': new IlluminationPage()
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