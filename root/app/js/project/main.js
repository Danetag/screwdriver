'use strict';

var $        = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;

var main = (function() {

  var Main = function(){


  };

  Main.prototype = {

    onReady: function() {

      console.log("--- ready", this);

    }
  }

  return new Main();

})();

$(document).ready(main.onReady.bind(main));

// Tell the module what to return/export
module.exports = main;