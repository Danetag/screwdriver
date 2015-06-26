'use strict';

var AbstractPageView      = require('abstract/view/DOM/page/pageView'),
    IndexTpl              = require('index.html');



var IndexView = function (options, datas){

  this.idView = 'index';
  this.id = 'index';

  this.template = IndexTpl;

  AbstractPageView.call(this, options, datas);

};

_.extend(IndexView, AbstractPageView);
_.extend(IndexView.prototype, AbstractPageView.prototype);

module.exports = IndexView;