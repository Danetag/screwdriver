'use strict';

var AbstractLoaderView  = require('abstract/view/DOM/loader/loaderView'),
    EVENT               = require('event/event'),
    LoaderBasicTpl      = require('loader/basic.html');

var LoaderViewBasic = function (options, datas){

  /*
   * Template of a basic loader
   * @type {mustache.template}
   */
  this.template = LoaderBasicTpl;

  /*
   * So you can hide when the 100% has been reached
   * @type {boolean}
   */
  this.canHide = false;


  AbstractLoaderView.call(this, options, datas);
  
};

_.extend(LoaderViewBasic, AbstractLoaderView);
_.extend(LoaderViewBasic.prototype, AbstractLoaderView.prototype);


LoaderViewBasic.prototype.initDOM = function() {
  this.$bar = this.$el.find('.bar');
  TweenLite.set( this.$el, { autoAlpha:0});
}

LoaderViewBasic.prototype.setPct = function(pct) {
  this.pct = pct;
  TweenLite.to(this.$bar, 0.5, { x:this.pct+'%', ease:Cubic.easeOut, onComplete:_checkEnd.bind(this)});
}

LoaderViewBasic.prototype.show = function() {
  TweenLite.to( this.$el, 0.3, { autoAlpha:1 , ease:Cubic.easeOut, onComplete:this.onShown.bind(this)});
}

LoaderViewBasic.prototype.hide = function() {
  setTimeout($.proxy(function(){
    TweenLite.to( this.$el, 0.3, { autoAlpha:0 , ease:Cubic.easeOut , onComplete:this.onHidden.bind(this)});
  }, this), 0);

}


var _checkEnd = function() {

  if(this.pct === 100) {

    this.trigger(EVENT.COMPLETE);
    
  }

}




module.exports = LoaderViewBasic;