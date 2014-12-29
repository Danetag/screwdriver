'use strict';

var $         			= require('jquery'),
    AbstractLoaderView  = require('abstract/view/DOM/loader/loaderView'),
    Backbone  			= require('backbone'),
    _                   = require('underscore'),
    EVENT               = require('event/event');

var LoaderViewEmpty = AbstractLoaderView.extend(new function (){});

// Override because no element to display
LoaderViewEmpty.prototype.render = function() {}


module.exports = LoaderViewEmpty;