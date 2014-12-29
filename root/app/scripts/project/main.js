'use strict';

var $        = require('jquery'),
    App      = require('app/app');



/**
 * Main: App entry point
 * @constructor
 */
var Main = function(){};




/**
 * Fired on document ready
 */
Main.prototype.onReady = function() {
  var app = new App();
  app.init();
}


var main = new Main();
$(document).ready(main.onReady.bind(main));

module.exports = main;