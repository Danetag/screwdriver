'use strict';

var $               = require('jquery'),
    Backbone        = require('backbone'),
    Config          = require('config/config'),
    Loader          = require('loader/loader'),
    EVENT           = require('event/event'),
    DatasManager    = require('datas/datasManager'),
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


  this.init = function(){
    
    console.log('**** Begin App ****');

    Config.init();

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

    Config.pages = this.loader.getItem('config').result;
    var routes = this.loader.getItem('routes').result;

    this.loader.dispose();
    this.loader = null;

    this.router = new Router();
    this.router.init(routes.pages);

    DatasManager.init(routes.all);

    Backbone.history.start({
      pushState: true,
      root: Config.root
    });
  }

});

module.exports = App;