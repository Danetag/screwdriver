'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    MedicalView         = require('page/pages/medical/views/medicalView'),
    Backbone            = require('backbone');

var MedicalPage = function (){

  AbstractPage.call(this);
  this.id = 'medical';
  
};

_.extend(MedicalPage, AbstractPage);
_.extend(MedicalPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
MedicalPage.prototype.instanceView = function() {
  this.view = new MedicalView();
}


module.exports = MedicalPage;