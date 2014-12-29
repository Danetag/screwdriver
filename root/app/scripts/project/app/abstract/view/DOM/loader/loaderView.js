'use strict';

var $                   = require('jquery'),
    AbstractDOMView     = require('abstract/view/DOM/DOMView'),
    Backbone            = require('backbone'),
    dot                 = require('dot'),
    _                   = require('underscore'),
    Config              = require('config/config');



/**
 * LoaderView: Defines a basic loader view
 * @extend {abstract/view/DOM/DOMView}
 * @constructor
 */
var LoaderView = AbstractDOMView.extend(new function (){

    /**
     * Percent loading of the current Loader
     * @type {number}
     */
    this.pct = 0;


    /**
     * Loader container element
     * @type {$}
     */
    this.$loaderContainer = null;

});



/**
 * Set the current percentage
 */
LoaderView.prototype.setPct = function(pct) {
    this.pct = pct;
}


/**
 * Defines the loader container. Basically the body, could be anything else.
 */
LoaderView.prototype.defineContainer = function($el) {
    this.$container = ($el != undefined) ? $el : $('body');
}


module.exports = LoaderView;