'use strict';

var Backbone   = require('backbone'),
    Config     = require('config/config'),
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
    ":lang/:page": "default",
    ":lang/:page/": "default"
  };

  /**
   * Routes defined on server side
   * @type {Object}
   */
  this.routesServer = null;

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
Router.prototype.init = function(routes) {
  this.routesServer = routes;
  this.mainPage.init();
}


/*
 * Callback for each route after push state.
 */
Router.prototype.default = function (lang, section) {

  var page = 'index';

  if (section != null) {

    for (var stn in this.routesServer[lang]) {
      
      if (stn == section) {
        page = this.routesServer[lang][stn];
        break;
      }
    }
  } 

  Config.lang = lang;

  this.mainPage.navigateTo(page);

};



module.exports = new Router();