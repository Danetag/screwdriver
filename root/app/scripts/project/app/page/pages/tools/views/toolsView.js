'use strict';

var $                     = require('jquery'),
    AbstractSectionView   = require('abstract/page/SectionView'),
    _                     = require('underscore'),
    ToolsTpl              = require('tpl/page/tools'),
    Backbone              = require('backbone');

var ToolsView = AbstractSectionView.extend(new function (){

  this.idView   = 'tools';
  this.id       = 'tools';

  this.template = _.template(ToolsTpl);

  this.initialize = function(options){
    AbstractSectionView.prototype.initialize.call(this, options);
  }


});

module.exports = ToolsView;