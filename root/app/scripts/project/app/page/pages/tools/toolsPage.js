'use strict';

var $                   = require('jquery'),
    _                   = require('underscore'),
    AbstractPage        = require('abstract/page'),
    ToolsView           = require('page/pages/tools/views/toolsView'),
    Backbone            = require('backbone');

var ToolsPage = function (){

  AbstractPage.call(this);

  this.id = 'tools';

};

_.extend(ToolsPage, AbstractPage);
_.extend(ToolsPage.prototype, AbstractPage.prototype);

/*
 * @overrided
 */
ToolsPage.prototype.instanceView = function() {
  this.view = new ToolsView();
}

module.exports = ToolsPage;