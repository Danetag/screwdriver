'use strict';

var $             = require('jquery'),
    EVENT         = require('event/event'),
    AbstractView  = require('abstract/view'),
    Config        = require('config/config'),
    Backbone      = require('backbone');

var PageView = AbstractView.extend(new function (){

  /*
   * Configuration of the view (assets...)
   * @type {Object}
   */
  this.configView = null;

  /*
   * Params object from router
   * @type {Objet}
   */
  this.params = {};

  /*
   * Datas object template
   * @type {Objet}
   */
  this.datas = {};

  /*
   * template
   * @type {dot template}
   */
  this.template = null;


  this.initialize = function(options) {

    options = (options != undefined) ? options : {};

    this.config = Config.getInstance();

    // is a view container ? A view container doesn't have any DOM related element.
    options.isViewContainer = (options.isViewContainer != undefined) ? options.isViewContainer : false;

    AbstractView.prototype.initialize.call(this, options);
  }

  this.init = function(params, datas) {

    this.params = params || {};
    this.datas = datas || {};

    this.initSubViews();
    this.initDOM();

    AbstractView.prototype.init.call(this);
  }

  this.initDOM = function() {

  }

  this.initSubViews = function() {

  }

  this.initConfig = function() {
    this.configView = Config.getInstance().pages[this.idView];
  }

  this.render = function() {

    // No need to render anything
    if (this.options.isViewContainer) return;

    // If already existing, get it from the DOM. Else, get it from the template
    if (this.id === null && this.template == null) {
      console.log('You have to provide at least a template nor an ID Container for ' + this.idView);
      return;
    }

    if (this.id != null) {

      this.$el = $('#' + this.id);

      if (this.$el.attr('id') !== this.id) {

        this.generateTemplate();
        
      } else {
        this.el = this.$el[0];
      }

    } else {
      this.generateTemplate();
    }

    this.subRenders();
    this.fixImgSrc();
    this.fixLinkSrc();

  };

  this.subRenders = function() {

  }

  this.fixImgSrc = function() {

    var c = Config.getInstance();
    var $imgs = this.$el.find('img');

    if (!$imgs.length) return;

    $.each($imgs, function(i, img){

      var $img = $(img);
      var src =  $img.attr('src');

      if (src.indexOf(c.patternPHPBaseUrl) > -1) {
        
        var idx = src.indexOf(c.patternPHPBaseUrl);

        var i = 0;
        var j = 0;
        
        while (src.substr(idx + i, c.patternPHPEnd.length) != c.patternPHPEnd) i++;
        while (src.substr(idx - j, c.patternPHPStart.length) != c.patternPHPStart) j++;

        var match = src.substring(idx - j, idx + i + c.patternPHPEnd.length);
        src = src.replace(match, c.baseUrl);

        $img.attr("src", src);
      }

    });
  }

  this.fixLinkSrc = function() {

    var c = Config.getInstance();
    var $imgs = this.$el.find('a');

    if (!$imgs.length) return;

    $.each($imgs, function(i, img){

      var $img = $(img);
      var src =  $img.attr('href');

      if (src.indexOf(c.patternPHPBaseUrl) > -1) {
        
        var idx = src.indexOf(c.patternPHPBaseUrl);

        var i = 0;
        var j = 0;
        
        while (src.substr(idx + i, c.patternPHPEnd.length) != c.patternPHPEnd) i++;
        while (src.substr(idx - j, c.patternPHPStart.length) != c.patternPHPStart) j++;

        var match = src.substring(idx - j, idx + i + c.patternPHPEnd.length);
        src = src.replace(match, c.baseUrl);

        $img.attr("href", src);
      }

    });
  }

  this.generateTemplate = function() {

    if (this.template == null) return;

    this.el = this.template(this.data);
    this.$el = $(this.el);

  }

  this.appendToContainer = function() {
    if (this.options.isViewContainer) return;
    $('#content').append(this.$el);
  }

  this.getAssetsByID = function(assets, ID) {

    var aAssets = {};

    for(var name in assets) {

      // Has to be at the beginning
      if (name.indexOf(ID + "_") === 0 ) {

        var currentId = ID + "_";
        var id = name.substr(currentId.length); // we remove the first part

        aAssets[id] = assets[name];
      }
    }

    return aAssets;

  }


});


module.exports = PageView;