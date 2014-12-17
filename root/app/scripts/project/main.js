'use strict';

var $        = require('jquery'),
    App      = require('app/app');

var main = (function() {

  /*
   * Main: Init the app
   * @constructor
   */
  var Main = function(){


  };

  Main.prototype = {

    /*
     * onReady: Trigger on document ready
     */
    onReady: function() {

      var app = new App();
      app.init();

    }
  }

  return new Main();

})();

$(document).ready(main.onReady.bind(main));

module.exports = main;