'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    CommunicationView   = require('page/pages/communication/views/communicationView'),
    Backbone            = require('backbone');

var CommunicationPage = function (){

  AbstractPage.call(this)
  this.id = 'communication';

};

_.extend(CommunicationPage, AbstractPage);
_.extend(CommunicationPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
CommunicationPage.prototype.instanceView = function() {
  this.view = new CommunicationView();
}

module.exports = CommunicationPage;