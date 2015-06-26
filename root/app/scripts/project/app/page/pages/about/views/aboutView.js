'use strict';

var AbstractPageView      = require('abstract/view/DOM/page/pageView'),
    AboutTpl              = require('about.html');



var AboutView = function (options, datas){

  this.idView = 'about';
  this.id = 'about';

  this.template = AboutTpl;

  AbstractPageView.call(this, options, datas);

};

_.extend(AboutView, AbstractPageView);
_.extend(AboutView.prototype, AbstractPageView.prototype);


module.exports = AboutView;