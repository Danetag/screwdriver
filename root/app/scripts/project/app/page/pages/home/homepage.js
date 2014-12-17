'use strict';

var $               = require('jquery'),
    _               = require('underscore'),
    AbstractPage    = require('abstract/page'),
    Loader          = require('loader/loader'),
    LoaderViewEmpty = require('loader/views/empty'),
    HomeView        = require('page/pages/home/views/homeView'),
    Backbone        = require('backbone');

var HomePage = function (){

  AbstractPage.call(this);

  this.id = 'homepage';

}

_.extend(HomePage, AbstractPage);
_.extend(HomePage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
HomePage.prototype.instanceView = function() {
  this.view = new HomeView();
}

/*
 * @override
 */
HomePage.prototype.initLoader = function() {
  this.loader = new Loader();
  this.loader.init(new LoaderViewEmpty());
}


module.exports = HomePage;