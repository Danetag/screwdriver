'use strict';

var $             = require('jquery'),
    EVENT         = require('event/event'),
    AbstractView  = require('abstract/view/view'),
    Config        = require('config/config'),
    DatasManager  = require('datas/datasManager'),
    Backbone      = require('backbone');


/**
 * PageView: Defines a view including the DOM logic
 * @extend {abstract/view/view}
 * @constructor
 */
var DOMView = AbstractView.extend(new function (){

  /**
   * Configuration of the view (assets...)
   * @type {Object}
   */
  this.configView = null;

  /**
   * Params object from router
   * @type {Objet}
   */
  this.params = {};

  /**
   * Datas object template
   * @type {Objet}
   */
  this.datas = {};

  /**
   * template
   * @type {dot.template}
   */
  this.template = null;

  /**
   * container element which contains the $el
   * @type {$}
   */
  this.$container = null;

  /**
   * Resize breakpoint
   * @type {Number}
   */
  this.refWidth = 1280;

});



/**
 * Initializes the view. Called on intanciation.
 * @override
 * @params {Object} options for the view
 *  options.isViewContainer Defines if the view is a container, which is this case, has been already appended to the DOM
 */
DOMView.prototype.initialize = function(options) {

  options = (options != undefined) ? options : {};

  // is a view container ? A view container doesn't have any DOM related element.
  options.isViewContainer = (options.isViewContainer != undefined) ? options.isViewContainer : false;

  this.options = options;

  this.render();
}


/**
 * @override
 */
DOMView.prototype.init = function(params) {

  this.params = params || {};

  this.initSubViews();
  this.initDOM();
  this.defineContainer();
  this.appendToContainer();
  this.resize();

  AbstractView.prototype.init.call(this);
}


/**
 * Handles the initialization of DOM element
 */
DOMView.prototype.initDOM = function() {

}


/**
 * Handles the initialization of the sub views
 */
DOMView.prototype.initSubViews = function() {

}


/**
 * Get the current view config from the Config object
 */
DOMView.prototype.initConfig = function() {
  this.configView = Config.pages[this.idView];
}



/**
 * @override
 * Handles the rendering. 
 * If this.id is provided, it tries to get the element from the DOM
 * If not, it generates the element based on the tempalte provided, and append it to the container
 */
DOMView.prototype.render = function() {

  // No need to render anything
  if (this.options.isViewContainer) return;

  // If already existing, get it from the DOM. Else, get it from the template
  if (this.id === null && this.template == null) {
    console.log('You have to provide at least a template nor an ID Container for ' + this.idView);
    return;
  }

  if (this.id != null) {

    this.$el = $('#' + this.id);

    if (this.$el.attr('id') !== this.id || this.$el[0] == undefined) {

      this.generateTemplate();
      
    } else {
      this.el = this.$el[0];
    }

  } else {
    this.generateTemplate();
  }

  this.subRenders();

};


/**
 * Handles the subrenders views
 */
DOMView.prototype.subRenders = function() {

}


/**
 * Generate the DOM element based on the provided template.
 */
DOMView.prototype.generateTemplate = function() {

  if (this.template == null) return;

  this.datas = DatasManager.get(this.id);

  this.el = this.template(this.datas);
  this.$el = $(this.el);

}


/**
 * Defines the view container
 */
DOMView.prototype.defineContainer = function($el) {
  if (this.options.isViewContainer) return;

  this.$container = ($el != undefined) ? $el : $('#content');
}



/**
 * Append the view to the container
 */
DOMView.prototype.appendToContainer = function($el) {
  if (this.options.isViewContainer) return;

  this.$container.append(this.$el);
}


/**
 * Get the assets associated to the view.
 */
DOMView.prototype.getAssetsByID = function(assets, ID) {

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



module.exports = DOMView;