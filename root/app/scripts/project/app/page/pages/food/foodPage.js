'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    FoodView            = require('page/pages/food/views/foodView'),
    Backbone            = require('backbone');

var FoodPage = function (){

  AbstractPage.call(this);
  this.id = 'food';

};

_.extend(FoodPage, AbstractPage);
_.extend(FoodPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
FoodPage.prototype.instanceView = function() {
  this.view = new FoodView();
}

module.exports = FoodPage;