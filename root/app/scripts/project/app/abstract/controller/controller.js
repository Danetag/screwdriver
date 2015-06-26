'use strict';

var EVENT           = require('event/event'),
    Config          = require('config/config'),
    Router          = require('router/router'),
    Loader          = require('loader/loader');

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
   * Page object from router
   * @type {Objet}
   */
  this.page = {};

  /**
   * Datas object from loader
   * @type {Objet}
   */
  this.datas = {};

  /**
   * Assets object from loader
   * @type {Objet}
   */
  this.assets = {};

  /**
   * Instance of Loader
   * @type {loader/loader}
   */
  this.loader = null;

}



/**
 * Handles the init
 * @param {Object} page Object.
 * params.hasLoading: A page doesn't necessarily have to be loaded.
 */
AbstractPage.prototype.init = function(page) {

  this.page = page || {};
  this.page.params = (this.page.params != undefined) ? this.page.params : {};

  if (this.isLoaded()) 
    this.datas = this.page.datasContent;

  if ((this.page.params.hasLoading === undefined || this.page.params.hasLoading) && !this.isLoaded()) {
    this.initLoader();
  }
  
}


/**
 *  Get current meta datas
 */
AbstractPage.prototype.getMetas = function() {
  return this.datas.meta;
}

/**
 * Return if a page has been already loaded
 * @return Boolean
 */
AbstractPage.prototype.isLoaded = function(){

  if (this.page.isLoaded) return true;
  return false;
}


/**
 * Set isLoaded status
 * @return Boolean
 */
AbstractPage.prototype.setIsLoaded = function(isLoaded_){
  this.page.isLoaded = isLoaded_;
}

/**
 * Creates a new view instance
 */
AbstractPage.prototype.instanceView = function() {

  if (this.view != null) return false;
  

  // So we don't have to reload them, they should be here anyway
  //this.datas = this.getCurrentDatas();
}

/**
 * Inits the view
 * If we need something from the loader to give to the view
 *  it should be here
 */
AbstractPage.prototype.initView = function() {
  
  if (this.view.isInit) return;

  this.listenToOnce(this.view, EVENT.INIT, this.viewInit.bind(this));

  // Init the view
  this.view.init(this.page.params, this.assets);

}

AbstractPage.prototype.viewInit = function() {

  // Destroy the assets reference
  // YOU MIGHT WANT TO KEEP THEM IN MEMORY. So override in case of :D
  this.assets = null;
  this.assets = {};
  
  this.trigger(EVENT.INIT);
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


  var assets = Config.getAssets({page:this.page});

  if (assets != null && this.loader != null)
    this.loader.addItems(assets);

  return assets;
}

/**
 * Adds the datas to load
 */
AbstractPage.prototype.initDatas = function() {

  var datas = Config.getDatas({page:this.page});

  if (datas != null && this.loader != null) {
    this.loader.addItems(datas);
  }

  return datas;
    
}

/**
 * Loading logic
 */
AbstractPage.prototype.load = function() {

  //console.log('AbstractPage.prototype.load', this.page.id);

  if (this.loader == null) return;

  this.initAssets();
  this.initDatas();

  this.listenToOnce(this.loader, EVENT.SHOWN, $.proxy(this.loaderShown,this));
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
  this.trigger(EVENT.LOADER_HIDDEN);
}

/**
 * The loading is complete
 */
AbstractPage.prototype.loaderComplete = function() {

  if (this.loader == null) return;

  //console.log('AbstractPage.prototype.loaderComplete', this.page);

  this.getCurrentAssets();
  this.getCurrentDatas();

  this.setIsLoaded(true);

  this.trigger(EVENT.LOADER_COMPLETE);
}

/**
 * Format current assets into params from the loader depending of the current page ID
 */
AbstractPage.prototype.getCurrentAssets = function(itemLoader_, loader_) {

  if (this.assets == null) this.assets = {};

  //console.log('this.assets', this.assets, this.isLoaded());

  // already loaded
  if (Object.keys(this.assets).length || this.isLoaded()) return this.assets;

  //if (this.loader == null && id_ == undefined) return null;

  //var page =  page_ || this.page;

  //console.log('this', this);

  var assets = itemLoader_ || Config.getAssets({page:this.page});
  var loader = (loader_ != undefined ) ? loader_ : this.loader;

  if (loader == null) return;

  var items = loader.items; //(loader_ != undefined ) ? loader_.items : this.loader.items;

  //console.log('assets', assets, items, this.page.id);

  for(var j in assets) {

    var asset = assets[j];

    for(var i in items) {

      var item = items[i];

      if (item.id === asset.id ) {
        this.assets[asset.id] = item;
      }
    }
  }

  return this.assets;
}

/**
 * Format current assets into params from the loader depending of the current page ID
 */
AbstractPage.prototype.getCurrentDatas = function(itemLoader_, loader_) {

  var datas = this.page.datasContent;

  //console.log('--getCurrentDatas', this.page.id, datas);

  if (datas != undefined && Object.keys(datas).length) {
    this.datas = datas;
    return this.datas;
  }

  //console.log('getCurrentDatas:: id_', id_, this);

  var itemLoader = itemLoader_ || Config.getDatas({page:this.page}); //cause it's an array
  var loader = (loader_ != undefined ) ? loader_ : this.loader;

  if (loader == null) return;

  var items = loader.items; //(loader_ != undefined ) ? loader_.items : this.loader.items;

  //console.log('getting datas based on', itemLoader, 'looking in these loader items', items);

  for(var i in items) {

    var item = items[i];

    if (item.src.indexOf(itemLoader[0].src) > -1) {
      //console.log('---', item.result);
      this.datas = item.result;
    }
  }

  // Keep datas consistant
  this.page.datasContent = this.datas;

  //console.log('this.page.datasContent', this.page.datasContent);

  //console.log('finally, this.datas', this.page.datasContent);
  
  return this.datas;

}

/**
 * Set params
 * @param {Object} params parameters for the page.
 */
AbstractPage.prototype.setParams = function(params) {
  this.params = params;
}

/**
 * Show the current view
 */
AbstractPage.prototype.show = function() {
  this.listenToOnce(this.view, EVENT.SHOWN, this.viewShown.bind(this));
  this.view.show();
}


/**
 * Current view shown
 */
AbstractPage.prototype.viewShown = function() {
  this.trigger(EVENT.SHOWN);
}


/**
 * Pre Hide the current view for transitions
 * @param nextPage_ Next page to load after this controller will be hidden
 */
AbstractPage.prototype.preHide = function(nextPage_) {

  if (this.view != null) {
    this.listenToOnce(this.view, EVENT.PRE_HIDDEN, this.viewPreHidden.bind(this));
    this.view.preHide();
  } else {
    this.viewPreHidden();
  }
  
}


/**
 * Hide the current view
 * @param nextPage_ Next page to load after this controller will be hidden
 */
AbstractPage.prototype.hide = function(nextPage_) {

  if (this.view != null) {
    this.listenToOnce(this.view, EVENT.HIDDEN, this.viewHidden.bind(this));
    this.view.hide(nextPage_);
  } else {
    this.viewHidden();
  }
  
}

/**
 * Pre Hide the current view for transitions
 * @param nextPage_ Next page to load after this controller will be hidden
 */
AbstractPage.prototype.postHide = function(nextPage_) {

  if (this.view != null) {
    this.listenToOnce(this.view, EVENT.POST_HIDDEN, this.viewPostHidden.bind(this));
    this.view.postHide();
  } else {
    this.viewPostHidden();
  }
  
}


/**
 * Current view hidden
 */
AbstractPage.prototype.viewHidden = function() {
  this.trigger(EVENT.HIDDEN);
}

/**
 * Current view hidden
 */
AbstractPage.prototype.viewPreHidden = function() {
  this.trigger(EVENT.PRE_HIDDEN);
}


/**
 * Current view hidden
 */
AbstractPage.prototype.viewPostHidden = function() {
  this.trigger(EVENT.POST_HIDDEN);
}


/**
 * Hide the loader
 */
AbstractPage.prototype.hideLoader = function() {

  //console.log('AbstractPage.prototype.hideLoader', this.page.id);

  if (this.loader == null) return;
  
  this.listenToOnce(this.loader, EVENT.HIDDEN, $.proxy(this.loaderHidden,this));
  this.loader.hide();


}

/**
 * The loader view is hidden
 */
AbstractPage.prototype.loaderHidden = function() {
 // console.log('AbstractPage.prototype.loaderHidden', this.page.id, this.loader);

  if (this.loader == null) return;

  this.trigger(EVENT.LOADER_HIDDEN);
}

/**
 * Dispose the loader
 */
AbstractPage.prototype.disposeLoader = function() {
  //console.log('AbstractPage.prototype.disposeLoader', this.page.id);
  if (this.loader != null) this.loader.dispose();

  this.stopListening(this.loader, EVENT.SHOWN, $.proxy(this.loaderShown,this));
  this.stopListening(this.loader, EVENT.COMPLETE, $.proxy(this.loaderComplete,this));
  this.stopListening(this.loader, EVENT.HIDDEN, $.proxy(this.loaderHidden,this));

  this.loader = null;
}

/**
 * Dispose the page
 * @param nextPage_ Next page to load after this controller will be disposed
 */
AbstractPage.prototype.dispose = function(nextPage_) {

  //console.log('AbstractPage.prototype.dispose', this.page.id, 'nextPage_', nextPage_);

  if (this.view != null)
    this.view.dispose();

  this.disposeLoader();
  this.view = null;

  this.datas = null;
  this.page = null;
}



module.exports = AbstractPage;