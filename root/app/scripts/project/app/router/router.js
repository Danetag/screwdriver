'use strict';

var Backbone   = require('backbone'),
    MainPage   = require('page/mainPage');
    

var Router = Backbone.Router.extend(new function (){

  /*
   * Defines routes for the application
   * @type {Object}
   */
  this.routes = {
      ":page/:params":"default",
      ":page":"default",
      "":"default"
  };

  /*
   * Instance of mainPage
   * @type {page/main/mainPage}
   */
  this.mainPage = null;

  this.initialize = function(){
    this.mainPage = new MainPage();
  }

  this.init = function() {
    this.mainPage.init();
  }

  this.default = function (page, params) {

    console.log('routing', page, this);
    
    page = (page == null) ? 'homepage' : page.toLowerCase();

    this.mainPage.navigateTo(page, params);
    //this.history.push(page);

  };

});


module.exports = Router;