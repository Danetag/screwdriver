'use strict';

var Backbone  = require('backbone'),
    Tools     = require('tools/tools'),
    $         = require('jquery');


var Config = function (){

  /**
   * Does the browser has audio available ?
   * @type {boolean}
   */
  this.hasAudio = false;

  /**
   * Does the browser is an IE browser ?
   * @type {boolean}
   */
  this.isIE = false;

  /**
   * Google Analytic ID
   * @type {String}
   */
  this.gaID = null;

  /**
   * Does the browser is an OLD IE browser ?
   * @type {boolean}
   */
  this.isOldIE = false;

  /**
   * Base URL of the website
   * @type {string}
   */
  this.baseUrl = window.location.origin || 'http://' + window.location.host;

  /**
   * Root used by Backbone.history
   * @type {string}
   */
  this.root = "";

  /**
   * Language used in the App
   * @type {string}
   */
  this.lang = "en";

  /**
   * Object with all the pages describes
   * @type {Object}
   */
  this.pages = {};

  /**
   * Is an High resolution screen ?
   * @type {boolean}
   */
  this.isHighRes = false;

  /**
   * Object containing device informations (based on Detectizr)
   * @type {Object}
   */
  this.device = null;

  /**
   * Save performance for browser in need
   * @type {boolean}
   */
  this.savePerformance = false;


}


Config.prototype.init = function() {

  Detectizr.detect();
  Tools.init();

  this.hasAudio = Modernizr.audio;

  if (CONF !== undefined && CONF.baseUrl !== undefined) {
    this.baseUrl = CONF.baseUrl;
  }

  if (CONF !== undefined && CONF.root !== undefined) {
    this.root = CONF.root;
  }

  if (CONF !== undefined && CONF.lang !== undefined) {
    this.lang = CONF.lang;
  }

  if ($('html').is('.ie6, .ie7, .ie8, .ie9, .ie10') || _isIE()) {
    this.isIE = true;
    document.documentElement.className ="is-ie " + document.documentElement.className;
  }

  this.isHighRes = _isHighRes();

  // srcset ?
  Modernizr.addTest('srcset', ('srcset' in document.createElement('img')) );
}

// IE 11 detection
var _isIE = function() { 
  return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null))); 
}

var _isHighRes = function() {
  var dpr = window.devicePixelRatio ||

  // fallback for IE
  (window.screen.deviceXDPI / window.screen.logicalXDPI) ||

  // default value
  1;

  return !!(dpr > 1);
}



/*
 * Get Page object from a Page
 */
Config.prototype.getPage = function(config_) {

  var page = (config_.page != undefined) ? config_.page : null;
  var id   = (config_.id   != undefined) ? config_.id   : null;
  var slug = (config_.slug != undefined) ? config_.slug : null;
  var lang = (config_.lang != undefined) ? config_.lang : this.lang;

  if (slug == null && page == null && id == null) {
    console.log('You have to provide at least an ID or a slug, or a page Object');
    return null;
  }

  // Mainpage exception
  if (id == "mainpage") return this.pages.mainpage;
  
  var pages = this.pages[lang];

  if (id != null)
    return _getPageByID.call(this, id, pages);

  slug = (slug != null) ? slug : page.slug;

  return _getPageBySlug.call(this, slug, pages);


}


var _getPageByID = function(id_, pages_, parent_){

  //console.log('_getPageByID', "id_", id_, "pages_", pages_, "parent_", parent_);

  var page_ = null;

  for (var pageID in pages_) {

    var page = pages_[pageID];

    //console.log('page.id = ', page.id, "looking for", id_);

    // Look into a particular page
    if (parent_ != undefined && page.id != parent_) continue;

    if (page.id == id_) {
      page_ = page;
      break;
    }

    // Haven't found anything, and has children 
    if (page.pages != undefined && page_ == null) {
      page_ = _getPageBySlug.call(this, id_, page.pages);
    }
    
  }

  //console.log('returnning page_', page_);

  return page_;
}



var _getPageBySlug = function(slug_, pages_, parent_){

  //console.log('_getPageBySlug', "slug_", slug_, "pages_", pages_, "parent_", parent_);

  var page_ = null;

  for (var pageID in pages_) {

    var page = pages_[pageID];

    //console.log('page.slug = ', page.slug, "looking for", slug_);

    // Look into a particular page
    if (parent_ != undefined && page.id != parent_) continue;

    if (page.slug == slug_) {
      page_ = page;
      break;
    }

    // Haven't found anything, and has children
    if (page.pages != undefined && page_ == null) {
      page_ = _getPageBySlug.call(this, slug_, page.pages);
    }
    
  }

  //console.log('returnning page_', page_);

  return page_;
}


Config.prototype.getRelativePages = function(page_, lang_) {

  var lang = lang_ || this.lang;

  return _getRelativePages.call(this, page_.section, this.pages[lang]);

  //console.log('aRelativePages', aRelativePages);

}

var _getRelativePages = function(pageSectionID_, pages_, aRelativePages_) {

  // Create it
  if (aRelativePages_ == undefined) 
    aRelativePages_ = [];

  for (var pageID in pages_) {

    var page = pages_[pageID];

    if (page.section == pageSectionID_ && page.section != page.id) {
      
      aRelativePages_.push(page);
      //console.log('fouuund', pageID_, page.id);
      
    }

    if (page.pages != undefined) {
      //console.log(pageID, 'has pages ! LETS LOOKING FOR ', pageID_);
      aRelativePages_ = _getRelativePages.call(this, pageSectionID_, page.pages, aRelativePages_);
    }

  }

  return aRelativePages_;

}

/*
 * Get Datas object from a pageID formatted for preloadJS
 */
Config.prototype.getDatas = function(config_) {

  if (config_.page != undefined && config_.page.datas != undefined) {
    return [{src: config_.page.datas, type:"json"}];
  }

  var page = this.getPage(config_);

  if (page == null || page.datas == undefined) return null;

  return [{src: page.datas, type:"json"}];

}


/*
 * Get Assets object from a pageID formatted for preloadJS
 */
Config.prototype.getAssets = function(config_) {

  if (config_.page != undefined && config_.page.assets != undefined) return config_.page.assets;

  var page = this.getPage(config_);

  if (page == null || page.assets == undefined) return [];

  return page.assets;

}

module.exports = new Config();