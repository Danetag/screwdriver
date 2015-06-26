'use strict';

var AbstractLoaderView  = require('abstract/view/DOM/loader/loaderView'),
    EVENT               = require('event/event'),
    LoaderMainTpl       = require('loader/main.html');

var LoaderViewMain = function (options, datas){

  this.idView = "loaderMain";

  /*
   * override
   */
  this.template = LoaderMainTpl;


  AbstractLoaderView.call(this, options, datas);

};

_.extend(LoaderViewMain, AbstractLoaderView);
_.extend(LoaderViewMain.prototype, AbstractLoaderView.prototype);

LoaderViewMain.prototype.initDOM = function() {
  this.$pct = this.$el.find('.pct');
}

LoaderViewMain.prototype.setPct = function(pct) {
  this.pct = pct;
  this.$pct.html(this.pct + "%");

  if (pct == 100) {
    this.trigger(EVENT.COMPLETE);
  }
}

LoaderViewMain.prototype.show = function() {
  TweenLite.to( this.$el, 0.3, { autoAlpha:1 , ease:Cubic.easeOut , onComplete:this.onShown.bind(this)});
}

LoaderViewMain.prototype.hide = function() {
  TweenLite.to( this.$el, 0.3, { autoAlpha:0 , ease:Cubic.easeOut , onComplete:this.onHidden.bind(this)});
}


module.exports = LoaderViewMain;