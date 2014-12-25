'use strict';

var $               = require('jquery'),
    Backbone        = require('backbone'),
    Config          = require('config/config'),
    Loader          = require('loader/loader'),
    EVENT           = require('event/event'),
    LoaderViewEmpty = require('loader/views/empty'),
    Router          = require('router/router');

Backbone.$ = $;

var App = Backbone.View.extend(new function (){

  /**
   * Instance of router/router
   * @type {Router}
   */
  this.router = null;

  /**
   * Instance of loader/loader
   * @type {Loader}
   */
  this.loader = null;

  /**
   * Instance of config/config
   * @type {Config}
   */
  this.config = null;

  this.init = function(){
    
    console.log('**** Begin App ****');

    this.config = Config.getInstance();
    this.config.init();

    _loadJsonConfig.call(this);

  }

  var _loadJsonConfig = function() {

    this.loader = new Loader();
    this.loader.init(new LoaderViewEmpty());

    this.listenToOnce(this.loader, EVENT.COMPLETE, _loaderComplete.bind(this));

    this.loader.addItem({ src: "/datas/config.json" , id:"config" })
    this.loader.addItem({ src: "/routes.json" , id:"routes" })

    this.loader.start();
  }

  var _loaderComplete = function(e) {

    this.config.pages = this.loader.getItem('config').result;
    this.config.routes = this.loader.getItem('routes').result;

    this.loader.dispose();
    this.loader = null;

    this.router = new Router();
    this.router.init(this.config.routes);

    Backbone.history.start({
      pushState: true,
      root: this.config.root
    });
  }

});

module.exports = App;