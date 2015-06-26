'use strict';


var AbstractDOMView     = require('abstract/view/DOM/DOMView'),
    EVENT               = require('event/event'),
    Config              = require('config/config');



/**
 * LoaderView: Defines a basic loader view
 * @extend {abstract/view/DOM/DOMView}
 * @constructor
 */
var LoaderView = function (options, datas){

    this.idView = (this.idView != undefined) ? this.idView : 'loader';

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


    AbstractDOMView.call(this, options, datas);


};

_.extend(LoaderView, AbstractDOMView);
_.extend(LoaderView.prototype, AbstractDOMView.prototype);


/**
 * Set the current percentage
 */
LoaderView.prototype.setPct = function(pct) {
    this.pct = pct;

    if(this.pct == 100) {
        this.trigger(EVENT.COMPLETE);
    }
}


/**
 * Defines the loader container. Basically the body, could be anything else.
 */
LoaderView.prototype.defineContainer = function($el) {
    this.$container = ($el != undefined) ? $el : $('body');
}

/**
 * @override
 */
LoaderView.prototype.dispose = function() {

    this.$loaderContainer = null;
    
    AbstractDOMView.prototype.dispose.call(this);
}


module.exports = LoaderView;