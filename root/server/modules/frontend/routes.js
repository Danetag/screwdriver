var express = require('express');
var routing = require('./core/Routing');

var FrontEndRouting = function() {

  routing.call(this);
  
}

FrontEndRouting.prototype = Object.create(routing.prototype);
FrontEndRouting.prototype.constructor = FrontEndRouting;

FrontEndRouting.prototype.initRoutes = function() {

  this.addRoute({
    route: '/',
    controller: 'homepage',
    action: 'index',
    frontRouting: false
  });

  this.addRoute({
    route: '/:@lang',
    lang: ':@lang',
    controller: 'index',
    action: 'index'
  });

  this.addRoute({
    route: '/:@lang/:@index',
    lang: ':@lang',
    controller: 'index',
    action: 'index',
    frontRouting: false
  });

  this.addRoute({
    route: '/:@lang/:@about',
    lang: ':@lang',
    controller: 'about',
    action: 'index'
  });

  this.addRoute({
    route: '/routes.json',
    controller: 'json',
    action: 'routes',
    frontRouting: false
  });
  
} 


module.exports = new FrontEndRouting();
