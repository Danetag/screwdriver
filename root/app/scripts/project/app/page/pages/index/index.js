'use strict';

var $               = require('jquery'),
    _               = require('underscore'),
    AbstractPage    = require('abstract/page'),
    Loader          = require('loader/loader'),
    LoaderViewEmpty = require('loader/views/empty'),
    IndexView       = require('page/pages/index/views/indexView'),
    Backbone        = require('backbone');

var IndexPage = function (){

  AbstractPage.call(this);

  this.id = 'index';

}

_.extend(IndexPage, AbstractPage);
_.extend(IndexPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
IndexPage.prototype.instanceView = function() {
  this.view = new IndexView();
}

/*
 * @override
 */
IndexPage.prototype.initLoader = function() {
  this.loader = new Loader();
  this.loader.init(new LoaderViewEmpty());
}


module.exports = IndexPage;