'use strict';

var Backbone        = require('backbone'),
    $               = require('jquery'),
    EVENT           = require('event/event'),
    Config          = require('config/config'),
    LoaderViewBasic = require('loader/views/basic');

var loader = Backbone.View.extend(new function (){

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

  this.init = function(loaderView) {

    this.loaderView = (loaderView != undefined) ? loaderView : new LoaderViewBasic();
    this.loaderView.init();

    this.items = []; 
    this.queue  = new createjs.LoadQueue(true);

    this.bindEvents();

  }

  this.bindEvents = function () {

    this.queue.addEventListener('fileload',  $.proxy(_onFileLoad, this));
    this.queue.addEventListener('filestart', $.proxy(_onFileStart, this));
    this.queue.addEventListener('loadstart', $.proxy(_onLoadStart, this));
    this.queue.addEventListener('complete',  $.proxy(_onComplete, this));
    this.queue.addEventListener('progress',  $.proxy(_onProgress, this));
    this.queue.addEventListener('error',     $.proxy(_onError, this));

  }
  
  this.unbindEvents = function () {
    this.queue.removeAllEventListeners();
  }

  this.addItem = function(item) {

    var config = Config.getInstance()

    var baseUrl = config.baseUrl;

    // Has a retina version provided and it's a retina screen ?
    if (config.isHighRes && item.src2x != undefined) {
      item.src = item.src2x;
    }

    // Add base URL if nothing is specified
    if (item.src.indexOf("http://") < 0 && item.src.indexOf("https://") < 0) {
      item.src = baseUrl + item.src;
    }

    this.items.push(item);
  }

  this.addItems = function(items) {

    for (var i in items) {
      this.addItem(items[i]);
    }
  }

  this.getItem = function(key) {

    //Find asset
    for (var i in this.items) {

      var item = this.items[i];

      if (item.id != null && item.id == key) {
        return item;
      }
    }

  }

  this.start = function() { 
    this.listenToOnce(this.loaderView, EVENT.SHOWN, _loaderShown.bind(this));
    this.listenToOnce(this.loaderView, EVENT.HIDDEN, _loaderHidden.bind(this));
    this.loaderView.show();
  }

  this.dispose = function() {
    this.unbindEvents();
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
    this.loaderView.setPct(Math.round(e.progress * 100));
  }

  var _onComplete = function(){
    this.trigger(EVENT.COMPLETE, {loader:this});
  }

  /* VIEW EVENT */

  var _loaderShown = function(e) {

    this.trigger(EVENT.SHOWN);

    if (!this.items.length) {
      this.loaderView.setPct(100);
      _onComplete.call(this);
      return;
    } 

    this.queue.loadTimeout = 999999; // Time in milliseconds to assume a load has failed.
    this.queue.loadManifest(this.items);
  }

  var _loaderHidden = function() {
    this.trigger(EVENT.HIDDEN);
  }

});

module.exports = loader;