'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    ShelterView         = require('page/pages/shelter/views/shelterView'),
    Backbone            = require('backbone');

var ShelterPage = function (){

  AbstractPage.call(this);
  this.id = 'shelter';

};

_.extend(ShelterPage, AbstractPage);
_.extend(ShelterPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
ShelterPage.prototype.instanceView = function() {
  this.view = new ShelterView();
}

module.exports = ShelterPage;