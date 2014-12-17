'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    PetView             = require('page/pages/pet/views/petView'),
    Backbone            = require('backbone');

var PetPage = function (){

  AbstractPage.call(this);
  this.id = 'pet';

};

_.extend(PetPage, AbstractPage);
_.extend(PetPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
PetPage.prototype.instanceView = function() {
  this.view = new PetView();
}

module.exports = PetPage;