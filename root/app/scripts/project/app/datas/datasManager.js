'use strict';

var $         = require('jquery'),
    EVENT     = require('event/event'),
    Config    = require('config/config'),
    _         = require('underscore'),
    Backbone  = require('backbone');

var DatasManager = function (){

  _.extend(this, Backbone.Events);

  /*
   * object as an associative array
   * @type {Object}
   */
  this.pages = {};

}


DatasManager.prototype.init = function(pages) {
  this.pages = pages;
}

DatasManager.prototype.get = function(id, l) {

	var lang = (lang != undefined) ? l : Config.lang;

	for (var pageID in this.pages[lang]) {
		if (pageID == id) {
			return this.pages[lang][id].datas;
		}
	}

	return null;
}


module.exports = new DatasManager();