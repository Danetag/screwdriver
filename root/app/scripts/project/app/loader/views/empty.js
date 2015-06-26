'use strict';

var AbstractLoaderView  = require('abstract/view/DOM/loader/loaderView'),
    EVENT               = require('event/event');

var LoaderViewEmpty = function (options, datas){

	AbstractLoaderView.call(this, options, datas);

};

_.extend(LoaderViewEmpty, AbstractLoaderView);
_.extend(LoaderViewEmpty.prototype, AbstractLoaderView.prototype);

// Override because no element to display
LoaderViewEmpty.prototype.render = function() {}


module.exports = LoaderViewEmpty;