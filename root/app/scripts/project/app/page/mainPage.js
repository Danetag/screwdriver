'use strict';

var $               = require('jquery'),
    Backbone        = require('backbone'),
    MainView        = require('page/main/views/mainView'),
    Loader          = require('loader/loader'),
    LoaderViewMain  = require('loader/views/main'),
    EVENT           = require('event/event'),
    AbstractPage    = require('abstract/page'),
    _               = require('underscore'),
    tools           = require('tools/tools'),
    PageManager     = require('page/pageManager');

var MainPage = function (){

  AbstractPage.call(this);

  /*
   * Instance of pageManager
   * @type {pageManager}
   */
  this.pageManager = null;

  /*
   * First time we enter in the app
   * @type {boolean}
   */
  this.firstTime = true;

  this.id = 'mainpage';

}

_.extend(MainPage, AbstractPage);
_.extend(MainPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
MainPage.prototype.init = function() {

  AbstractPage.prototype.init.call(this);

  this.pageManager = new PageManager();
  this.pageManager.init();

  _bindEvents.call(this);
}

/*
 * @overrided
 */
MainPage.prototype.instanceView = function() {
  this.view = new MainView({isViewContainer:true});
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


MainPage.prototype.navigateTo = function(pageID, parameters) {

  console.log('MainPage::', pageID);

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


var _loaderComplete = function() {
  this.listenToOnce(this.pageManager.currentPage.view, EVENT.INIT, _currentPageViewInit.bind(this));

  this.pageManager.currentPage.isLoaded = true;

  this.initView();
  this.pageManager.currentPage.initView();
}

var _currentPageViewInit = function() {
  this.listenToOnce(this.loader.loaderView, EVENT.HIDDEN, _loaderHidden.bind(this));

  // Resize here to place all the elements
  _onResize.call(this);
  _onOrientationChange.call(this);

  this.loader.loaderView.hide();
}

var _loaderHidden = function() {
  this.listenToOnce(this.view, EVENT.SHOWN, _mainViewShown.bind(this));
  this.view.show();
}

var _mainViewShown = function() {
  this.listenToOnce(this.pageManager.currentPage.view, EVENT.SHOWN, _currentPageViewShown.bind(this));
  this.pageManager.currentPage.view.show();
}

var _currentPageViewShown = function() {
  this.loader.dispose();
  this.loader = null;
  
  // We are happy.
  console.log('ALL DONE !');
}

/* Events */

var _bindEvents = function() {
  window.addEventListener("resize",  $.proxy(_onResize, this), false);
  document.addEventListener("mouseout",  $.proxy(_onMouseOut, this), false);
  
  window.requestAnimationFrame(_onRAF.bind(this));

  if("onorientationchange" in window) {
    window.addEventListener("orientationchange", $.proxy(_onOrientationChange, this), false);
  }
}

var _onOrientationChange = function() {

  var viewport = {
    width  : $(window).width(),
    height : $(window).height()
  }

  if (this.pageManager.currentPage !== null) {
    this.pageManager.currentPage.view.orientationChange(viewport);
  }

  this.view.orientationChange(viewport);
}


var _onMouseOut = function(e) {
  var from = e.relatedTarget || e.toElement;

  var outWindow = false;
  if (!from || from.nodeName == "HTML") outWindow = true;

  if (this.pageManager.currentPage !== null) {
    this.pageManager.currentPage.view.onMouseOut(outWindow);
  }

  this.view.onMouseOut(outWindow);

}

var _onResize = function(e) { 

  var viewport = {
    width  : $(window).width(),
    height : $(window).height()
  }

  if (this.pageManager.currentPage !== null) {
    this.pageManager.currentPage.view.resize(viewport);
  }

  this.view.resize(viewport);
  this.pageManager.viewport = viewport;
  
}

var _onRAF = function() {

  if (this.pageManager.currentPage !== null && this.pageManager.currentPage.view != null) {
    this.pageManager.currentPage.view.update();
  }

  if (this.view != null) this.view.update();

  window.requestAnimationFrame(_onRAF.bind(this));

}



module.exports = MainPage;