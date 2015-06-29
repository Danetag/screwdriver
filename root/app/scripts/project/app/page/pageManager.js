'use strict';

var EVENT               = require('event/event'),
    Config              = require('config/config'),
    IndexPage           = require('page/pages/index/index'),
    AboutPage           = require('page/pages/about/about'),
    Analytics           = require('app/tools/analytics');




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

  this.analytics = new Analytics();
}


/*
 * Handles the initialization
 */
PageManager.prototype.init = function() {
  _initPages.call(this);
}


/*
 * Entry point to change pages
 * @param {Object} page of the page to navigate to.
 */
PageManager.prototype.navigateTo = function(page) {

  //console.log('PageManager:: navigateTo', page.id, 'currentPage:: ', this.currentPage.page.id);

  // If same page, resend params.
  if (this.currentPage !== null && this.currentPage.id === page.id) {
    console.log('same page')
    //this.currentPage.setParams(page.params);
    return;
  }

  // If the previous page still lives, so it could be a backslash during a loading. 
  // and the user requests a different page
  if (this.oldPage !== null) {
    
    if (this.currentPage.page.id !== page.id) {
      console.log('BACK !', this.currentPage.page.id, page.id)
      //Backbone.history.history.back();
    }

    return;
  }


  this.setCurrentPage(page);
  //page.params.hasLoading = true;

  if (!page.params.hasLoading)
    this.listenTo(this.currentPage, EVENT.CLEAN_CURRENT_CONTENT, _cleanCurrentContent.bind(this));

  this.listenTo(this.currentPage, EVENT.LOADER_INIT, _currentPageLoaderInit.bind(this));
  this.currentPage.init(page);
}


/*
 * Set the current page
 * @param {Object} page of the page to navigate to.
 */
PageManager.prototype.setCurrentPage = function(page) {

  //page.params = (page.params != undefined) ? page.params : {};

  if (this.pages[page.id] == undefined) {
    console.log('PageManager:: Error: Please create a controller/view for the ' + page.id + ' ID, then register the page in the PageManager');
    return;
  }

  this.oldPage = this.currentPage;

  if (this.currentPage != null) 
    _unbindEvents.call(this);

  //console.log('NEW CURRENT PAGE', page);

  this.currentPage = new this.pages[page.id]();

}


/**
 * Instance all the pages here
 * @private
 */
var _initPages = function() {

  this.pages = {
    'index': IndexPage,
    'about': AboutPage
  }

}

var _cleanCurrentContent = function(){
  this.trigger(EVENT.CLEAN_CURRENT_CONTENT);
}

/** Transition logic **/

var _currentPageLoaderInit = function() {
  // Starts here
  _preHideOldPage.call(this);

}

var _preHideOldPage = function() {
  this.listenToOnce(this.oldPage, EVENT.PRE_HIDDEN, _oldPagePreHidden.bind(this));
  this.oldPage.preHide();
}

var _oldPagePreHidden = function() {
  _hideOldPage.call(this)
}


/**
 * Hide the page currently displayed
 * @private
 */
var _hideOldPage = function() {

  // In case the aoder is firing. At this point, it shouldn;t do anything tho.
  this.stopListening(this.oldPage, EVENT.LOADER_HIDDEN, _currentPageLoaderHidden.bind(this));

  this.listenToOnce(this.oldPage, EVENT.HIDDEN, _oldPageHidden.bind(this));
  this.listenToOnce(this.oldPage, EVENT.DISPOSE, _disposePage.bind(this)); // Just in case we want to dispose directly the page

  // Remove here
  //console.log('-- remove event loader old page + new one to destroy the old view in case', this.oldPage.page);

  this.stopListening(this.oldPage, EVENT.LOADER_SHOWN, _currentPageLoaderShown.bind(this));
  this.stopListening(this.oldPage, EVENT.LOADER_COMPLETE, _currentPageLoaderComplete.bind(this));
  this.stopListening(this.oldPage, EVENT.LOADER_HIDDEN, _currentPageLoaderHidden.bind(this));
  this.stopListening(this.oldPage, EVENT.LOADER_INIT, _currentPageLoaderInit.bind(this));
  this.stopListening(this.oldPage, EVENT.INIT, _currentPageViewInit.bind(this));

  this.listenToOnce(this.oldPage, EVENT.LOADER_SHOWN, _disposePage.bind(this));
  this.listenToOnce(this.oldPage, EVENT.LOADER_COMPLETE, _disposePage.bind(this));
  this.listenToOnce(this.oldPage, EVENT.LOADER_HIDDEN, _disposePage.bind(this));
  this.listenToOnce(this.oldPage, EVENT.LOADER_INIT, _currentPageLoaderInit.bind(this));
  this.listenToOnce(this.oldPage, EVENT.INIT, _disposePage.bind(this));

  this.oldPage.hide(this.currentPage.page);
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

  //console.log('PageManager::_loadCurrentPage', this.currentPage.page);

  if (!this.currentPage.isLoaded()) {
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
  //_disposePage.call(this);
}

var _disposePage = function() {

  if (this.oldPage == null) return;

  //kill old listener in case it's still here
  this.stopListening(this.oldPage, EVENT.DISPOSE, _disposePage.bind(this)); 
  this.stopListening(this.oldPage, EVENT.HIDDEN, _oldPageHidden.bind(this));

  this.stopListening(this.oldPage, EVENT.LOADER_SHOWN, _disposePage.bind(this));
  this.stopListening(this.oldPage, EVENT.LOADER_COMPLETE, _disposePage.bind(this));
  this.stopListening(this.oldPage, EVENT.LOADER_HIDDEN, _disposePage.bind(this));
  this.stopListening(this.oldPage, EVENT.LOADER_HIDDEN, _currentPageLoaderHidden.bind(this));
  this.stopListening(this.oldPage, EVENT.INIT, _disposePage.bind(this));

  this.oldPage.dispose(this.currentPage.page);

  this.oldPage = null;
}

/**
 * Once the loader is complete, we init the view
 * @private
 */
var _currentPageLoaderComplete = function() {

  if (this.oldPage == null) {
    _oldPagePostHidden.call(this)
  } else {
    this.listenToOnce(this.oldPage, EVENT.POST_HIDDEN, _oldPagePostHidden.bind(this));
    this.oldPage.postHide();
  }

}

var _oldPagePostHidden = function() {
  _disposePage.call(this);

 // console.log('_currentPageLoaderComplete', this.currentPage.page);
  this.listenToOnce(this.currentPage, EVENT.INIT, _currentPageViewInit.bind(this));
  this.initCurrentView();
}

// For mainPage as well
PageManager.prototype.initCurrentView = function() {

  //update title
  if (this.currentPage.getMetas() != undefined)
    document.title = this.currentPage.getMetas().title;

  this.currentPage.instanceView();
  _bindEvents.call(this);

  this.currentPage.initView();

}

/**
 * The current page is init, hide the loader
 * @private
 */
var _currentPageViewInit = function() {

  //force resize on the current view here
  this.currentPage.view.onResize();

  if (this.currentPage.loader != null) {
    this.listenToOnce(this.currentPage, EVENT.LOADER_HIDDEN, _currentPageLoaderHidden.bind(this));
    this.currentPage.hideLoader();

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
  this.listenToOnce(this.currentPage, EVENT.SHOWN, _currentPageViewShown.bind(this));

  this.currentPage.disposeLoader();
  this.currentPage.show();
}

/**
 * The current view is shown, mission complete
 * @private
 */
var _currentPageViewShown = function() {
  this.trigger(EVENT.SHOWN);
}


/**
 * Binding current view Event
 * @private
 */
var _bindEvents = function() {
  this.listenTo(this.currentPage.view, EVENT.ON_PLAY, $.proxy(_onPlay, this));
  this.listenTo(this.currentPage.view, EVENT.ON_STOP, $.proxy(_onStop, this));
}


/**
 * Unbinding current view Event
 * @private
 */
var _unbindEvents = function() {
  this.stopListening(this.currentPage.view, EVENT.ON_PLAY, $.proxy(_onPlay, this));
  this.stopListening(this.currentPage.view, EVENT.ON_STOP, $.proxy(_onStop, this));
}


/**
 * On Play
 * @private
 */
var _onPlay = function(e){
  this.trigger(EVENT.ON_PLAY, e);
}

var _onStop = function(e){
  this.trigger(EVENT.ON_STOP, e);
}

module.exports = PageManager;