'use strict';

var $                     = require('jquery'),
    _                     = require('underscore'),
    AbstractController    = require('abstract/controller/controller'),
    Loader                = require('loader/loader'),
    LoaderViewEmpty       = require('loader/views/empty'),
    IndexView             = require('page/pages/index/views/indexView'),
    Backbone              = require('backbone');



var IndexPage = function (){

  AbstractController.call(this);

  this.id = 'index';

}

_.extend(IndexPage, AbstractController);
_.extend(IndexPage.prototype, AbstractController.prototype);



/*
 * @overrided
 */
IndexPage.prototype.instanceView = function() {
  this.view = new IndexView();
}


module.exports = IndexPage;