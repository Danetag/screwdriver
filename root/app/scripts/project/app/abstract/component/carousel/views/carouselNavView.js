'use strict';

var AbstractPageView      = require('abstract/view/DOM/page/pageView'),
    CarouselNavTpl        = require('m/components/carousel/carouselNav.mustache'),
    Config                = require('config/config'),
    EVENT                 = require('event/event');



var CarouselNavView = function (options, datas){

  this.template = CarouselNavTpl;

  AbstractPageView.call(this, options, datas);

};

_.extend(CarouselNavView, AbstractPageView);
_.extend(CarouselNavView.prototype, AbstractPageView.prototype);

module.exports = CarouselNavView;