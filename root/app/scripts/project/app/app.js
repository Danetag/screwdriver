'use strict';

var Config          = require('config/config'),
    Loader          = require('loader/loader'),
    EVENT           = require('event/event'),
    LoaderViewEmpty = require('loader/views/empty'),
    Router          = require('router/router');

Backbone.$ = $;



/**
 * app: Init the app
 * @constructor
 */
var App = function (){

  _.extend(this, Backbone.Events);

  /**
   * Instance of Loader
   * @type {loader/loader}
   */
  this.loader = null;

};



/**
 * Handles the init
 */
App.prototype.init = function(){
  
  console.log('**** Begin App ****');

  Config.init();

  _loadJsonConfig.call(this);

}


/**
 * Load the configuration JSON files
 * @private
 */
var _loadJsonConfig = function() {

  this.loader = new Loader();
  this.loader.init(new LoaderViewEmpty());

  this.listenToOnce(this.loader, EVENT.COMPLETE, _loaderComplete.bind(this));

  this.loader.addItem({ src: "/routes.json" , id:"routes" })

  this.loader.start();
}


/**
 * On loading completed
 * @param {Event} e Loader event.
 * @private
 */
var _loaderComplete = function(e) {

  Config.pages = this.loader.getItem('routes').result;

  this.loader.dispose();
  this.loader = null;

  Config.init();

  this.listenToOnce(Router, EVENT.INIT, _onRouterInit.bind(this));
  Router.init();
}

var _onRouterInit = function() {

  Backbone.history.start({
    pushState: true,
    root: Config.root
  });

}



module.exports = App;