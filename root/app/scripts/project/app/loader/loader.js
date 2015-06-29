'use strict';

var EVENT           = require('event/event'),
    Config          = require('config/config'),
    LoaderViewBasic = require('loader/views/basic');

var Loader = function (){

  _.extend(this, Backbone.Events);

  /*
   * Array of objects containign src to load and type
   * @type {array.<Object>}
   */
  this.items  = [];

  /*
   * Instance of createjs preloader
   * @type {LoadQueue}
   */
  this.queue  = null;

  /*
   * Instance of LoaderView
   * @type {loader/views}
   */
  this.loaderView  = null;

}

Loader.prototype.init = function(loaderView) {

  this.loaderView = (loaderView != undefined) ? loaderView : new LoaderViewBasic();

  this.items = []; 
  this.queue  = new createjs.LoadQueue(true);
  
  if ( Detectizr.device.type == "desktop" && 
       Detectizr.browser.name != 'ie'
      ) {
    // install ONLY on desktop and NOT IE.
    this.queue.installPlugin(createjs.Sound);
  }

  this.bindEvents();

  this.listenToOnce(this.loaderView, EVENT.INIT, _loaderInit.bind(this));
  this.loaderView.init();

}

var _loaderInit = function() {
  this.trigger(EVENT.INIT);
}

Loader.prototype.bindEvents = function () {

  this.queue.addEventListener('fileload',  $.proxy(_onFileLoad, this));
  this.queue.addEventListener('filestart', $.proxy(_onFileStart, this));
  this.queue.addEventListener('loadstart', $.proxy(_onLoadStart, this));
  this.queue.addEventListener('complete',  $.proxy(_onComplete, this));
  this.queue.addEventListener('progress',  $.proxy(_onProgress, this));
  this.queue.addEventListener('error',     $.proxy(_onError, this));

}

Loader.prototype.unbindEvents = function () {
  
  this.stopListening(this.loaderView, EVENT.SHOWN, _loaderShown.bind(this));
  this.stopListening(this.loaderView, EVENT.COMPLETE, _loaderViewComplete.bind(this));
  this.stopListening(this.loaderView, EVENT.HIDDEN, _loaderHidden.bind(this));

  this.queue.removeAllEventListeners();
}

Loader.prototype.addItem = function(item_) {

  var baseUrl = Config.baseUrl;
  
  var item = {};
  item.src = item_.src;
  item.id = item_.id;
  item.type = item_.type;

  // Has a retina version provided and it's a retina screen ?
  if (Config.isHighRes && item_.src2x != undefined) {
    item.src = item_.src2x;
  }

  // this isn't necessary. because everything is off of the root.
  // Add base URL if nothing is specified
  //if (item_.src.indexOf("http://") < 0 && item_.src.indexOf("https://") < 0) {
  // item.src = baseUrl + item_.src;
  //}

  this.items.push(item);
}

Loader.prototype.addItems = function(items) {

  for (var i in items) {
    this.addItem(items[i]);
  }
}

Loader.prototype.getItem = function(key) {

  //Find asset
  for (var i in this.items) {

    var item = this.items[i];

    if (item.id != null && item.id == key) {
      return item;
    }
  }

}

Loader.prototype.start = function() { 
  this.listenToOnce(this.loaderView, EVENT.SHOWN, _loaderShown.bind(this));
  this.listenToOnce(this.loaderView, EVENT.COMPLETE, _loaderViewComplete.bind(this));
  this.loaderView.show();
}

Loader.prototype.hide = function() {
  this.listenToOnce(this.loaderView, EVENT.HIDDEN, _loaderHidden.bind(this));
  this.loaderView.hide();
}

var _loaderHidden = function() {
  this.trigger(EVENT.HIDDEN);
}

Loader.prototype.dispose = function() {

  this.unbindEvents();

  this.queue.removeAll();
  this.queue = null;

  this.items.length = 0;
  this.items = [];

  this.loaderView.dispose();
  this.loaderView = null;
}

/* LOADING EVENT */

var _onFileStart = function(e) {
  //console.log('_onFileStart');
}

var _onLoadStart = function(e) {
  //console.log('_onLoadStart');
}

var _onFileLoad = function(e) {

  //Find asset
  for (var i in this.items) {

    var item = this.items[i];

    if (item.id != null && item.id == e.item.id) {
      item.result = e.result;
      item.raw = e.rawResult;
      return;
    }

  }

}

var _onError = function(e) {
  //console.log('error loading');
}

var _onProgress = function(e) {
  //e.progress
  var pct = Math.round(e.progress * 100);

  if (pct < 100)
    this.loaderView.setPct(pct);
}

var _onComplete = function(){
  this.loaderView.setPct(100);
}

var _loaderViewComplete = function() {
  this.trigger(EVENT.COMPLETE, {loader:this});
}

/* VIEW EVENT */

var _loaderShown = function(e) {

  this.trigger(EVENT.SHOWN);

  if (!this.items.length) {
    _onComplete.call(this);
    return;
  } 

  this.queue.loadTimeout = 999999; // Time in milliseconds to assume a load has failed.
  this.queue.loadManifest(this.items);
}





module.exports = Loader;