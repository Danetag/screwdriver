'use strict';

var Config     = require('config/config'),
    EVENT      = require('event/event'),
    MainPage   = require('page/mainPage');
    

/**
 * Router: Routing logic
 * @extends {Backbone.Router}
 * @constructor
 */
var Router = Backbone.Router.extend(new function (){

  /**
   * Defines routes for the application
   * @type {Object}
   */
  this.routes = {

    ":lang": "default",
    ":lang/": "default",

    ":lang/:slug": "default",
    ":lang/:slug/": "default"
  };


  /**
   * Instance of mainPage
   * @type {page/main/mainPage}
   */
  this.mainPage = null;

});



/*
 * @override
 */
Router.prototype.initialize = function(){
  this.mainPage = new MainPage();
}


/*
 * Handles the init
 */
Router.prototype.init = function() {
  this.listenToOnce(this.mainPage, EVENT.LOADER_INIT, _onMainPageInit.bind(this));
  this.mainPage.init();
}

var _onMainPageInit = function() {
  this.trigger(EVENT.INIT);
}


/*
 * Callback for each route after push state.
 */
Router.prototype.default = function (lang_, slug_) {

  var config = {lang: lang_};

  if (slug_ != null) 
    config.slug = slug_;
  else
    config.id = "index";

  var page = Config.getPage(config);

  this.mainPage.navigateTo(page);

};



module.exports = new Router();