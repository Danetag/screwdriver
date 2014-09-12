var express = require('express');
var routing = require('../../core/Routing');

var frontRouter = (function() {

  var FrontEndRouting = function() {
    
    routing.call(this);
    
  }

  FrontEndRouting.prototype = Object.create(routing.prototype);
  FrontEndRouting.prototype.constructor = FrontEndRouting;

  FrontEndRouting.prototype.initRoutes = function() {

    this.addRoute({
      route: '/',
      controller: 'homepage',
      action: 'index'
    });

    this.addRoute({
      route: '/:@lang',
      lang: ':@lang',
      controller: 'index',
      action: 'index'
    });

    this.addRoute({
      route: '/:@lang/:@about/',
      lang: ':@lang',
      controller: 'about',
      action: 'index'
    });
    
  } 


  return FrontEndRouting;

})();

module.exports = new frontRouter();
