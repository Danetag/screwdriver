'use strict';

var $                     = require('jquery'),
    Backbone              = require('backbone'),
    MainView              = require('page/main/views/mainView'),
    Loader                = require('loader/loader'),
    LoaderViewMain        = require('loader/views/main'),
    EVENT                 = require('event/event'),
    AbstractController    = require('abstract/controller/controller'),
    _                     = require('underscore'),
    tools                 = require('tools/tools'),
    DatasManager          = require('datas/datasManager'),
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

  this.id = 'mainpage';

}

_.extend(MainPage, AbstractController);
_.extend(MainPage.prototype, AbstractController.prototype);



/*
 * @overrided
 */
MainPage.prototype.init = function() {

  AbstractController.prototype.init.call(this);

  this.pageManager = new PageManager();
  this.pageManager.init();
}


/*
 * @overrided
 */
MainPage.prototype.instanceView = function() {
  this.view = new MainView({isViewContainer: true});
}


/*
 * @overrided
 */
MainPage.prototype.initLoader = function() {
  this.loader = new Loader();
  this.loader.init(new LoaderViewMain());
}


/*
 * @overrided
 */
MainPage.prototype.initAssets = function() {

  var mainAsset     = this.view.configView.assets;
  var currentAssets = this.pageManager.currentPage.view.configView.assets;

  //Add prefix if id
  for (var i in mainAsset) {
    var asset = mainAsset[i];

    if (asset.id != undefined) {
      asset.id = this.id + "_" + asset.id;
    }
  }

  for (var i in currentAssets) {
    var asset = currentAssets[i];

    if (asset.id != undefined) {
      asset.id = this.pageManager.currentPage + "_" + asset.id;
    }
  }

  this.loader.addItems(_.union(mainAsset, currentAssets));
}


/*
 * Navigate to a page. Basically called form the router.
 */
MainPage.prototype.navigateTo = function(pageID, parameters) {

  var params = parameters || {};

  if (!this.firstTime) {
    this.pageManager.navigateTo(pageID, params);
  } else {

    this.firstTime = false;

    //no loading for the current Page, the main Page takes care of it
    params.hasLoading = false;

    this.pageManager.setCurrentPage(pageID, params);

    this.listenToOnce(this.loader, EVENT.COMPLETE, _loaderComplete.bind(this))

    this.load();

  }
}


/*
 * On loading is complete
 * @private
 */
var _loaderComplete = function() {
  this.listenToOnce(this.pageManager.currentPage.view, EVENT.INIT, _currentPageViewInit.bind(this));

  this.pageManager.currentPage.isLoaded = true;

  this.initView();
  this.pageManager.currentPage.initView();
}


/*
 * On the current page view is init
 * @private
 */
var _currentPageViewInit = function() {
  this.listenToOnce(this.loader.loaderView, EVENT.HIDDEN, _loaderHidden.bind(this));

  // Bind event + Resize here to place all the elements
  _bindEvents.call(this);
  _onResize.call(this);
  _onOrientationChange.call(this);

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
  this.listenToOnce(this.pageManager.currentPage.view, EVENT.SHOWN, _currentPageViewShown.bind(this));
  this.pageManager.currentPage.view.show();
}


/*
 * On current view shown
 * @private
 */
var _currentPageViewShown = function() {
  this.loader.dispose();
  this.loader = null;
  
  // We are happy.
}

/* Events */


/*
 * Bind events, all trigerred from the main view
 * @private
 */
var _bindEvents = function() {
  this.listenTo(this.view, EVENT.ON_ORIENTATION_CHANGE, $.proxy(_onOrientationChange, this));
  this.listenTo(this.view, EVENT.ON_RESIZE, $.proxy(_onResize, this));
  this.listenTo(this.view, EVENT.ON_RAF, $.proxy(_onRAF, this));
  this.listenTo(this.view, EVENT.ON_MOUSE_OUT, $.proxy(_onMouseOut, this));
}


/*
 * On orientation change
 * @private
 */
var _onOrientationChange = function(e) {
  var viewport = e || undefined;
  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.orientationChange(viewport);
  }
}


/*
 * On resize
 * @private
 */
var _onResize = function(e) { 
  var viewport = e || undefined;
  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.resize(viewport);
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
}


/*
 * On mouse out
 * @private
 */
var _onMouseOut = function(e) {
  if (this.pageManager.currentPage !== null) {
    this.pageManager.currentPage.view.onMouseOut(e.outWindow);
  }
}


module.exports = MainPage;