'use strict';

var Backbone   = require('backbone'),
    Config     = require('config/config'),
    MainPage   = require('page/mainPage');
    

var Router = Backbone.Router.extend(new function (){

  /*
   * Defines routes for the application
   * @type {Object}
   */
  this.routes = {
    ":lang": "default",
    ":lang/": "default",
    ":lang/:page": "default",
    ":lang/:page/": "default"
  };

  /*
   * Routes defined on server side
   * @type {Object}
   */
  this.routesServer = null;

  /*
   * Instance of mainPage
   * @type {page/main/mainPage}
   */
  this.mainPage = null;

  this.initialize = function(){
    this.mainPage = new MainPage();
  }

  this.init = function(routes) {
    this.routesServer = routes;
    this.mainPage.init();
  }

  this.default = function (lang, section) {

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

    console.log('> routing', lang, page);

    this.mainPage.navigateTo(page);

  };

});


module.exports = Router;