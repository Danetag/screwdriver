'use strict';

//var $                     = require('zepto-browserify').$,
var EVENT                 = require('event/event'),
    Config                = require('config/config'),
    // _                     = require('underscore'),
    Loader                = require('loader/loader'),
    AbstractController    = require('abstract/controller/controller');
    // Backbone              = require('backbone');

/**
 * AbstractManager: Acts like a controller for MainPage or PageManager,
 *  But under the hood manage one or n items to load/show
 * @extend {AbstractController}
 * @constructor
 */
var AbstractManager = function (){

  AbstractController.call(this);

  this.aRelativePages = [];

  this.currentPage = null;
  this.oldPage = null;

  this.currentIndex = 0;
  this.oldIndex = 0;

  this.firstTime = true;

  this.nodeName = "pages";

}

_.extend(AbstractManager, AbstractController);
_.extend(AbstractManager.prototype, AbstractController.prototype);


/**
 * @override
 */
AbstractManager.prototype.init = function(page_) {

  page_.params = (page_.params != undefined) ? page_.params : {};

  this.initARelativePages(page_);

  //console.log('---Init maanager : page_', page_);

  if (!this.firstTime) {
    this.defineCurrentPage(page_);
  }

  // From MainPage
  if (page_.params.hasLoading != undefined && !page_.params.hasLoading) {
    page_.params.hasLoading = true;
    this.trigger(EVENT.CLEAN_CURRENT_CONTENT);
  }

  if (!this.isLoaded()) {
    this.initLoader();
  } 
    

}


/**
 * @override
 */
AbstractManager.prototype.defineCurrentPage = function(page_) {

  //console.log('defineCurrentPage');

  this.oldPage = this.currentPage;
  this.oldIndex = this.currentIndex;

  for (var i in this.aRelativePages){
    var relativePage = this.aRelativePages[i];

    if (relativePage.page.id == page_.id) {
      this.currentIndex = parseInt(i);
      this.currentPage = relativePage;
    }

  }



}


/**
 * Return if a page has been already loaded
 * @return Boolean
 */
AbstractManager.prototype.isLoaded = function(){

  //Look the currentItem, and both next and previous items.
  // If all of them have been loaded yet, skip the loading.
  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];


  if (this.currentPage.page.isLoaded
    && previous.page.isLoaded
    && next.page.isLoaded
    && this.page.isLoaded)
    return true;

  return false;

}


/**
 * Set isLoaded status
 * @return Boolean
 */
AbstractManager.prototype.setIsLoaded = function(isLoaded_){
  this.page.isLoaded = isLoaded_;

  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];

  previous.setIsLoaded(true);
  next.setIsLoaded(true);
  this.currentPage.setIsLoaded(true);

}



/**
 * Creates a Loader instance. Have to be overrided in case of special LoaderView
 */
AbstractManager.prototype.initLoader = function() {

  this.loader = new Loader();

  if(!this.firstTime)
    this.initInBetweenPagesLoader();
  else
    this.initFirstTimeLoader();

}


/*
* Init the loader for the first time
* To override
*/
AbstractManager.prototype.initFirstTimeLoader = function() {
  console.log('initFirstTimeLoader');
  this.loader.init();
}


/*
* Init the loader for the transition between 2 pages
* To override
*/
AbstractManager.prototype.initInBetweenPagesLoader = function() {
  console.log('>> initInBetweenPagesLoader');
  this.loader.init();
}


/*
* Create a controller (page).
* To override with the correct controller
*/
AbstractManager.prototype.createPage = function() {
  return new AbstractController();
}

AbstractManager.prototype.initARelativePages = function(page_) {

  if (!this.firstTime) return;

  //console.log('AbstractManager.prototype.initARelativePages');

  // find all the relatives pages based on the section property
  // put them in this.aRelativePages
  var aRelativePages = Config.getRelativePages(page_);
  aRelativePages = _.sortBy(aRelativePages, function(obj){ return obj.params.index });
  
  // Get current index and page
  for (var i in aRelativePages) {

    var p = aRelativePages[i];

    p.params.hasLoading = false; // no loading, we handle it here.

    // Init the controller
    var page = this.createPage();
    page.init(p);

    if (p.id == page_.id) {
      this.currentIndex = parseInt(i);
      this.currentPage = page;
    }  

    this.aRelativePages.push(page);

  }

  // Setup parent page
  this.page = Config.getPage(page_.section);

}




/**
 * Adds the datas to load
 * Load the main data
 */
AbstractManager.prototype.initDatas = function() {

  var datas = Config.getDatas(this.page.section);

  //console.log('AbstractManager.prototype.initDatas', datas);

  if (datas != null && this.loader != null) {
    this.loader.addItems(datas);
  }

  return datas;
    
}


/**
 * Adds the assets to load
 */
AbstractManager.prototype.initAssets = function() {

  var section = Config.getPage(this.page.section); //get the assets of the section
  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];

  //console.log('initAssets manager', this.currentIndex + 1, this.aRelativePages.length - 1, this.aRelativePages[this.currentIndex + 1]);
  var assets = _.union(
    section.assets,
    this.currentPage.initAssets(), 
    previous.initAssets(), 
    next.initAssets());

  //console.log('AbstractManager.prototype.initAssets', assets);

  if (assets != null && this.loader != null)
    this.loader.addItems(assets);

  return assets;
}

/**
 * The loading is complete
 */
AbstractManager.prototype.loaderComplete = function() {


  //console.log('AbstractManager.prototype.loaderComplete');
  

  this.getCurrentAssets(undefined, this.loader);
  this.getCurrentDatas(undefined, this.loader);

  this.setIsLoaded(true);

  this.trigger(EVENT.LOADER_COMPLETE);
}

AbstractManager.prototype.getCurrentDatas = function(itemLoader_, loader_) {

  //if (Object.keys(this.datas).length) return this.datas;

  //console.log('AbstractManager:: getCurrentDatas', loader_, this.loader);

  var itemLoader = itemLoader_ || Config.getDatas(this.page.section); //cause it's an array
  var items = (loader_ != undefined ) ? loader_.items : this.loader.items;

  // Getting the main datas
  AbstractController.prototype.getCurrentDatas.call(this, itemLoader_, loader_);
  //this.getCurrentDatas(itemLoader_, items_);

  this.setRelativePagesDatas();

  return this.datas;

}

AbstractManager.prototype.setRelativePagesDatas = function() {

  // Populate with
  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];

  //console.log('===this.datas', this.datas);
  //console.log('===this.page', this.page);
  //console.log('---this.currentPage', this.currentPage.isLoaded(), this.currentPage, this.currentPage.page.datasContent);
  //console.log('---previous', previous.isLoaded(), previous, previous.page.datasContent);
  //console.log('---next', next.isLoaded(), next, next.page.datasContent);

  if (previous.page.datasContent == undefined || !previous.isLoaded()) {
    previous.datas = this.datas[this.nodeName][previous.page.id];
    previous.page.datasContent = this.datas[this.nodeName][previous.page.id];
  } else {
    previous.datas = previous.page.datasContent;
  }

  if (next.page.datasContent == undefined || !next.isLoaded()) {
    next.datas = this.datas[this.nodeName][next.page.id];
    next.page.datasContent = this.datas[this.nodeName][next.page.id];
  } else {
    next.datas = next.page.datasContent;
  }

  if (this.currentPage.page.datasContent == undefined || !this.currentPage.isLoaded()) {
    this.currentPage.datas = this.datas[this.nodeName][this.currentPage.page.id];
    this.currentPage.page.datasContent = this.datas[this.nodeName][this.currentPage.page.id];
  } else {
    this.currentPage.datas = this.currentPage.page.datasContent;
  }

}



AbstractManager.prototype.getCurrentAssets = function(itemLoader_, loader_) {

  //console.log('AbstractManager:: getCurrentAssets');

  var itemLoader = itemLoader_ || Config.getDatas(this.page.section); //cause it's an array
  var items = (loader_ != undefined ) ? loader_.items : this.loader.items;

  // Getting the main assets
  AbstractController.prototype.getCurrentAssets.call(this, itemLoader_, loader_);

  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];

  previous.getCurrentAssets(itemLoader_, loader_);
  next.getCurrentAssets(itemLoader_, loader_);
  this.currentPage.getCurrentAssets(itemLoader_, loader_);

  return this.assets;
}


/**
 * Creates a new view instance
 */
AbstractManager.prototype.instanceView = function() {

  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];
  
  if (this.view == null) {
    this.instanceManagerView();
  } 

  previous.instanceView();
  this.currentPage.instanceView();
  next.instanceView();
  
}

AbstractManager.prototype.instanceManagerView = function() {

}

/**
 * @override
 */
AbstractManager.prototype.initView = function() {

  //console.log('AbstractManager.prototype.initView ');

  if (!this.view.isInit) {
    this.listenToOnce(this.view, EVENT.INIT, this.managerViewInit.bind(this));
    this.view.init(this.page.params, this.assets);
  } else 
    this.managerViewInit();
  
}


AbstractManager.prototype.managerViewInit = function() {

  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];
  
  if (!previous.view.isInit)
    this.listenToOnce(previous, EVENT.INIT, this.pageInit.bind(this));

  if (!next.view.isInit)
    this.listenToOnce(next, EVENT.INIT, this.pageInit.bind(this));

  if (!this.currentPage.view.isInit)
    this.listenToOnce(this.currentPage, EVENT.INIT, this.pageInit.bind(this));

  //Update container
  previous.page.params.$container = this.view.$managerContainer;
  previous.page.params.prepend = true; // True in any case
  next.page.params.$container = this.view.$managerContainer;
  this.currentPage.page.params.$container = this.view.$managerContainer;

  // Order matters!
  previous.initView();
  this.currentPage.initView();
  next.initView();
  
  // If everything has been ini yet.
  if (previous.view.isInit && next.view.isInit && this.currentPage.view.isInit)
    this.pageInit();

}

AbstractManager.prototype.pageInit = function() {

  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];

  if (previous.view.isInit 
    && next.view.isInit 
    && this.currentPage.view.isInit) {

    // Give a reference to the ManagerView
    this.view.setUpPages({
      previousView: previous.view,
      currentView: this.currentPage.view,
      nextView: next.view
    });

    // Kill assets
    this.assets = null;
    this.assets = {};

    next.assets = null;
    next.assets = {};

    this.currentPage.assets = null;
    this.currentPage.assets = {};

    previous.assets = null;
    previous.assets = {};

    this.trigger(EVENT.INIT);
  }
}


/**
 * @override
 */
AbstractManager.prototype.show = function() {

  this.firstTime = false;

  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];

  AbstractController.prototype.show.call(this);

}


/**
 * @override
 */
AbstractManager.prototype.hide = function(nextPage_) {

  //if nextPage_ is not a page contained in this Manager
  var hideManager = true;

  for (var i in this.aRelativePages) {
    var relativePage = this.aRelativePages[i];

    if (relativePage.page.id == nextPage_.id)
      hideManager = false;
  }

  this.listenToOnce(this.view, EVENT.HIDDEN, this.viewHidden.bind(this));
  this.view.hide(hideManager);
}

/**
 * Dispose the page
 */
AbstractManager.prototype.dispose = function(nextPage_) {

  var disposeManager = true;

  if (nextPage_.id == this.page.id)
    disposeManager = false;

  var previous = (this.currentIndex - 1 >= 0) ? this.aRelativePages[this.currentIndex - 1] : this.aRelativePages[this.aRelativePages.length - 1];
  var next = (this.currentIndex + 1 <= this.aRelativePages.length - 1) ? this.aRelativePages[this.currentIndex + 1] : this.aRelativePages[0];

  // DIpose all the pages that are not display
  var aToNotDispose = [previous, next, this.currentPage];

  for (var i in this.aRelativePages) {

    var relativePage = this.aRelativePages[i];
    var disposeIt = true;

    for (var j in aToNotDispose) {
      var notDispose = aToNotDispose[j];

      if (notDispose.page.id == relativePage.page.id)
        disposeIt = false;
    }

    if (disposeIt) {
      relativePage.dispose();
    }

  }

  aToNotDispose.length = 0;
  aToNotDispose = null;

  // DISPOSE EVERYTHING
  if (disposeManager) {

    for (var i in this.aRelativePages) {
      var relativePage = this.aRelativePages[i];
      relativePage.dispose();
    }

    this.page.params.$container = null;
    previous.page.params.$container = null;
    next.page.params.$container = null;
    this.currentPage.page.params.$container = null;
    
    this.aRelativePages = [];
    this.currentPage = null;
    this.oldPage = null;
    this.currentIndex = 0;
    this.oldIndex = 0;
    this.firstTime = true;

    AbstractController.prototype.dispose.call(this);

  }

}

module.exports = AbstractManager;