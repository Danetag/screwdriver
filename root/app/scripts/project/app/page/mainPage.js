'use strict';

var MainView              = require('page/main/views/mainView'),
    Loader                = require('loader/loader'),
    LoaderViewMain        = require('loader/views/main'),
    Config                = require('config/config'),
    EVENT                 = require('event/event'),
    Router                = require('router/router'),
    AbstractController    = require('abstract/controller/controller'),
    tools                 = require('tools/tools'),
    PageManager           = require('page/pageManager');



/**
 * MainPage: Handles the main app logic, and all the main DOM events.
 * @extend {abstract/controller/controller}
 * @constructor
 */
var MainPage = function (){

  AbstractController.call(this);

  /*
   * Instance of pageManager
   * @type {page/pageManager}
   */
  this.pageManager = null;

  /*
   * First time we enter in the app
   * @type {boolean}
   */
  this.firstTime = true;


  this.currentAssets = [];
  this.currentDatas = [];

}

_.extend(MainPage, AbstractController);
_.extend(MainPage.prototype, AbstractController.prototype);



/*
 * @override
 */
MainPage.prototype.init = function() {

  this.pageManager = new PageManager();
  this.pageManager.init();

  _bindPageManagerEvents.call(this);

  this.instanceView();

  var mainPage = Config.getPage({id:"mainpage"});
  AbstractController.prototype.init.call(this, mainPage);
  
  this.listenTo(this.pageManager, EVENT.CLEAN_CURRENT_CONTENT, this.cleanCurrentContent.bind(this));

}


/*
 * @override
 */
MainPage.prototype.instanceView = function() {

  this.view = new MainView({isViewContainer:true});

  // Bind the main events now
  this.view.bindMainEvents();
  _bindMainEvents.call(this);

  this.view.noContent();

}

/*
 * @override
 */
MainPage.prototype.initLoader = function() {
  this.loader = new Loader();
  this.loader.init(new LoaderViewMain());

  // Force resize to have the actual browser size available
  this.view.forceResize();
}


/*
 * @override
 */
MainPage.prototype.initAssets = function() {

  var mainAsset      = this.page.assets;
  this.currentAssets = this.pageManager.currentPage.initAssets();

  this.loader.addItems(_.union(mainAsset, this.currentAssets));
}

/**
 * @override
 */
MainPage.prototype.initDatas = function() {

  this.currentDatas = this.pageManager.currentPage.initDatas();

  if (this.currentDatas != null) {
    this.loader.addItems(this.currentDatas);
  }
    
}


/*
 * Navigate to a page. Basically called form the router.
 */
MainPage.prototype.navigateTo = function(page) {

  if (!this.firstTime) {
    this.pageManager.navigateTo(page);
  } else {

    this.firstTime = false;

    if (page == null || page == undefined) {
      console.log("The page wasn't found in the Config.getPage() function");
      return;
    }

    page.params = (page.params != undefined) ? page.params : {};

    //no loading for the current Page, the main Page takes care of it
    page.params.hasLoading = false;

    this.pageManager.setCurrentPage(page);

    this.load();
    
  }
}


MainPage.prototype.cleanCurrentContent = function() {
  this.view.cleanCurrentContent();
}



/*
 * On loading is complete
 * @private
 */
MainPage.prototype.loaderComplete = function() {

  // Give the datas + assets of the current page to the current page
  this.pageManager.currentPage.getCurrentDatas(this.currentDatas, this.loader);
  this.pageManager.currentPage.getCurrentAssets(undefined, this.loader);

  // This page is loaded now.
  this.pageManager.currentPage.setIsLoaded(true);

  // console.log("mainpage page", this.page)

  // Init Main View
  this.listenToOnce(this.view, EVENT.INIT, _mainPageViewInit.bind(this));
  this.initView();
  
}


/*
 * On main page view is init
 * @private
 */
var _mainPageViewInit = function() {
  this.listenToOnce(this.pageManager.currentPage, EVENT.INIT, _currentPageViewInit.bind(this));
  this.pageManager.initCurrentView();
}


/*
 * On the current page view is init
 * @private
 */
var _currentPageViewInit = function() {
  this.listenToOnce(this.loader.loaderView, EVENT.HIDDEN, _loaderHidden.bind(this));
  this.loader.loaderView.hide();
}


/*
 * On loader hidden
 * @private
 */
var _loaderHidden = function() {
  this.listenToOnce(this.view, EVENT.SHOWN, _mainViewShown.bind(this));
  this.view.show();
}


/*
 * On main view shown
 * @private
 */
var _mainViewShown = function() {
  this.listenToOnce(this.pageManager.currentPage, EVENT.SHOWN, _currentPageViewShown.bind(this));
  this.pageManager.currentPage.show();
}


/*
 * On current view shown
 * @private
 */
var _currentPageViewShown = function() {

  this.loader.dispose();
  this.loader = null;

  this.pageManager.currentPage.page.params.hasLoading = true;

  this.view.showSubviews();

  this.currentAssets.length = 0;
  this.currentAssets = null;

  this.currentDatas.length = 0;
  this.currentDatas = null;

  this.assets = null;
  this.datas = null;
}



/* Events */


/*
 * Bind main events, all trigerred from the main view
 * @private
 */
var _bindMainEvents = function() {
  this.listenTo(this.view, EVENT.ON_ORIENTATION_CHANGE, $.proxy(_onOrientationChange, this));
  this.listenTo(this.view, EVENT.ON_RESIZE, $.proxy(_onResize, this));
  this.listenTo(this.view, EVENT.ON_RAF, $.proxy(_onRAF, this));
  this.listenTo(this.view, EVENT.ON_MOUSE_OUT, $.proxy(_onMouseOut, this));
  this.listenTo(this.view, EVENT.ON_MOUSE_MOVE, $.proxy(_onMouseMove, this));
  this.listenTo(this.view, EVENT.ON_MOUSE_DOWN, $.proxy(_onMouseDown, this));
  this.listenTo(this.view, EVENT.ON_MOUSE_UP, $.proxy(_onMouseUp, this));
  this.listenTo(this.view, EVENT.ON_SCROLL, $.proxy(_onScroll, this));
  this.listenTo(this.view, EVENT.ON_PLAY, $.proxy(_onPlay, this));
  this.listenTo(this.view, EVENT.ON_STOP, $.proxy(_onStop, this));
}


/*
 * Bind apge Manager events, all trigerred from the main view
 * @private
 */
var _bindPageManagerEvents = function() {
  this.listenTo(this.pageManager, EVENT.ON_PLAY, $.proxy(_onPlay, this));
  this.listenTo(this.pageManager, EVENT.ON_STOP, $.proxy(_onStop, this));
}

/*
 * On orientation change
 * @private
 */
var _onOrientationChange = function(e) {
  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.orientationChange();
  }
}


/*
 * On resize
 * @private
 */
var _onResize = function(e) { 
  
  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.resize();
  }

  // Main Loader
  if (this.loader != null && this.loader.loaderView != null) {
    this.loader.loaderView.resize();
  }

  // Current Loader
  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.loader != null && this.pageManager.currentPage.loader.loaderView != null) {
    this.pageManager.currentPage.loader.loaderView.resize();
  }

}


var _onScroll = function() {

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.onScroll();
  }

}

/*
 * On request animation frame
 * @private
 */
var _onRAF = function(e) { 

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.update();
  }

  // Main Loader
  if (this.loader != null && this.loader.loaderView != null) {
    this.loader.loaderView.update();
  }
}


/*
 * On mouse out
 * @private
 */
var _onMouseOut = function(e) {
  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.onMouseOut();
  }

  // Main Loader
  if (this.loader != null && this.loader.loaderView != null) {
    this.loader.loaderView.onMouseOut();
  }
}


/*
 * On mouse Move
 * @private
 */
var _onMouseMove = function(e) {

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.mouseMove();
  }

  // Main Loader
  if (this.loader != null && this.loader.loaderView != null) {
    this.loader.loaderView.mouseMove();
  }
}


/*
 * On mouse Down
 * @private
 */
var _onMouseDown = function(e) {

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.mouseDown();
  }

  // Main Loader
  if (this.loader != null && this.loader.loaderView != null) {
    this.loader.loaderView.mouseDown();
  }
}


/*
 * On mouse Up
 * @private
 */
var _onMouseUp = function(e) {

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.mouseUp();
  }

  // Main Loader
  if (this.loader != null && this.loader.loaderView != null) {
    this.loader.loaderView.mouseUp();
  }
}


var _onPlay = function(e) {

  this.view.stopAllMedia(e.mediaID);

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.stopAllMedia(e.mediaID);
  }
}

var _onStop = function(e) {

  this.view.resumeLastMediaPlaying(e.mediaID);

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.resumeLastMediaPlaying(e.mediaID);
  }
  
}


module.exports = MainPage;

