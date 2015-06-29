'use strict';

var EVENT         = require('event/event'),
    AbstractView  = require('abstract/view/view'),
    dot           = require('dot'),
    Config        = require('config/config');

/**
 * PageView: Defines a view including the DOM logic
 * @extend {abstract/view/view}
 * @constructor
 */
var DOMView = function (options, datas){

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
   * Option object
   * @type {Objet}
   */
  this.options = {};

  /**
   * Datas object template
   * @type {Objet}
   */
  this.datas = {};

  /**
   * Assets object template
   * @type {Objet}
   */
  this.assets = {};

  /**
   * template
   * @type {Mustache.template}
   */
  this.template =  (this.template != undefined) ? this.template : null;

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

  /**
   * Current ID View
   * @type {String}
   */
  this.idView = (this.idView != undefined) ? this.idView : '';

  /**
   * dataID in case of no id
   * @type {String}
   */
  this.dataID =  (this.dataID != undefined) ? this.dataID : null;

  /**
   * array of subviews (children)
   * @type {array.<DOMViews>}
   */
  this.aSubViews = [];


  AbstractView.call(this);
  Backbone.View.call(this, options, datas);

};

_.extend(DOMView, Backbone.View);

// Composition!
_.extend(DOMView.prototype, AbstractView.prototype);
_.extend(DOMView.prototype, Backbone.View.prototype);


/**
 * Initializes the view. Called on intanciation.
 * @override
 * @params {Object} options for the view
 *  options.isViewContainer Defines if the view is a container, which is this case, has been already appended to the DOM
 */
DOMView.prototype.initialize = function(options, datas) {

  this.options = (options != undefined) ? options : {};
  this.datas = (datas != undefined) ? datas : {}; //put in a page property to match the templating datas style

  if(this.options.id != undefined) this.id = this.options.id;
  if(this.options.el != undefined) this.el = this.options.el;
  if(this.options.dataID != undefined) this.dataID = this.options.dataID;
  if(this.options.template != undefined) this.template = this.options.template;

  // is a view container ? A view container doesn't have any DOM related element.
  this.options.isViewContainer = (this.options.isViewContainer != undefined) ? this.options.isViewContainer : false;

  this.render();
  
}


/**
 * @override
 */
DOMView.prototype.init = function(params, assets) {

  if (this.isInit) return;

  this.params = params || {};
  this.assets = assets;

  this.initDOM();
  this.defineContainer();
  this.appendToContainer();

  this.initSubViews();
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
  this.onSubViewsInit();
}

/**
 * once all the subviews are init as well
 */
DOMView.prototype.onSubViewsInit = function() {

  var check = true;

  for (var i in this.aSubViews) {
    var subView = this.aSubViews[i]
    if (!subView.isInit) check = false;
  }

  if (check) {
    this.allInit();
  }
  
}


DOMView.prototype.allInit = function() {

  this.assets = null;

  // call super init here to trigger the init event
  AbstractView.prototype.init.call(this);
}

/**
 * @override
 * Handles the rendering. 
 * If this.id is provided, it tries to get the element from the DOM
 * If not, it generates the element based on the tempalte provided, and append it to the container
 */
DOMView.prototype.render = function() {

  // If el provided, use it.
  if (this.options.el) {
    this.$el = $(this.el);
    this.subRenders();
    return;
  }

  // No need to render anything
  if (this.options.isViewContainer) {

    if (this.id != null) {
      this.$el = $('#' + this.id);
      this.el = this.$el[0];
    } else if (this.dataID != null) {
      this.$el = $('*[data-id=' + this.dataID + ']');
      this.el = this.$el[0];
    }
      
    this.subRenders();
    
    return;
  }

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

  }  else if (this.dataID != null) {

    this.$el = $('[data-id=' + this.dataID + ']');

    if (this.$el.data('id') !== this.dataID || this.$el[0] == undefined) {

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
 * Stop the videos
 */
DOMView.prototype.stopAllMedia = function(id_) {
  
}

/**
 * Stop the videos
 */
DOMView.prototype.resumeLastMediaPlaying = function(id_) {
  
}

/**
 * Start the videos
 */
DOMView.prototype.startingPlayingMedia = function(e) {
  this.trigger(EVENT.ON_PLAY, {mediaID: e.mediaID});
}

/**
 * Start the videos
 */
DOMView.prototype.stopingPlayingMedia = function(e) {
  this.trigger(EVENT.ON_STOP, {mediaID: e.mediaID});
}

DOMView.prototype.onResize = function() {

  for (var i in this.aSubViews) {
    var subView = this.aSubViews[i];
    subView.onResize();
  }
  
}



/**
 * Generate the DOM element based on the provided template. 
 */
DOMView.prototype.generateTemplate = function() {

  if (this.template == null) return;

  var pagefn = dot.template(this.template);

  if (Object.keys(this.datas).length){
    this.datas.lang = Config.lang;
    this.datas.BASEURL = Config.baseUrl;
  }

  this.el = pagefn(this.datas);

  this.$el = $(this.el);
}


/**
 * Defines the view container
 */
DOMView.prototype.defineContainer = function($el) {
  if (this.options.isViewContainer) return;

  //console.log('defineContainer', this.id, this.params.$container);

  if (this.params.$container != undefined || this.params.$container != null) 
    $el = this.params.$container;

  //console.log('DOMView.prototype.defineContainer::$el', $el, this.params.$container, this);

  this.$container = ($el != undefined) ? $el : $('#content');
}



/**
 * Append the view to the container
 */
DOMView.prototype.appendToContainer = function($el) {

  if (this.options.isViewContainer) return;

  //console.log('appendToContainer', this, "this.$el", this.$el, 'this.$container', this.$container);

  if (this.params.prepend != undefined && this.params.prepend)
    this.$container.prepend(this.$el);
  else
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


/**
 * @override
 */
DOMView.prototype.dispose = function() {

  // Kill al the subViews
  for (var i in this.aSubViews) {
    var subView = this.aSubViews[i];
    subView.dispose();
  }

  this.aSubViews.length = 0;
  this.aSubViews = [];

  // Kill all parameters, like assets references
  this.params = null;
  this.assets = null;

  this.params = {};
  this.assets = {};

  this.$container = null;
  
  AbstractView.prototype.dispose.call(this);
}



module.exports = DOMView;