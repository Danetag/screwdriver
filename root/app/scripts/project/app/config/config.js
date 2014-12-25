'use strict';

var Backbone  = require('backbone'),
    $         = require('jquery');

var conf = (function() {

  var _instance = null;

  var Config = function (){

    /**
     * Does the browser has audio available ?
     * @type {boolean}
     */
    this.hasAudio = false;

    /**
     * Does the browser is an IE browser ?
     * @type {boolean}
     */
    this.isIE = false;

    /**
     * Base URL of the website
     * @type {string}
     */
    this.baseUrl = window.location.origin || 'http://' + window.location.host;

    /**
     * Root used by Backbone.history
     * @type {string}
     */
    this.root = "";

    /**
     * Object with assets configuration for each view
     * @type {Object}
     */
    this.pages = {};

    /**
     * Object with all the routes
     * @type {Object}
     */
    this.routes = {};

    /**
     * Is an High resolution screen ?
     * @type {boolean}
     */
    this.isHighRes = false;

    /**
     * Object containing device informations (based on Detectizr)
     * @type {Object}
     */
    this.device = null;

    /**
     * PHP variable name for base URL. In order to fix the src issue.
     * @type {string}
     */
    this.patternPHPBaseUrl = '$baseURL';

    /**
     * PHP start
     * @type {string}
     */
    this.patternPHPStart = '<?php';

    /**
     * PHP end
     * @type {string}
     */
    this.patternPHPEnd = '?>';


    this.init = function() {

      Detectizr.detect();

      this.hasAudio = Modernizr.audio;

      if (CONF !== undefined && CONF.baseUrl !== undefined) {
        this.baseUrl = CONF.baseUrl;
      }

      if (CONF !== undefined && CONF.root !== undefined) {
        this.root = CONF.root;
      }

      if ($('html').is('.ie6, .ie7, .ie8, .ie9, .ie10') || _isIE()) {
        this.isIE = true;
        document.documentElement.className ="is-ie " + document.documentElement.className;
      }

      this.isHighRes = _isHighRes();

      // srcset ?
      Modernizr.addTest('srcset', ('srcset' in document.createElement('img')) );
    }

    // IE 11 detection
    var _isIE = function() { 
      return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null))); 
    }

    var _isHighRes = function() {
      var dpr = window.devicePixelRatio ||

      // fallback for IE
      (window.screen.deviceXDPI / window.screen.logicalXDPI) ||

      // default value
      1;

      return !!(dpr > 1);
    }


  };

  // Expose only the getInstance method.
  return {
    getInstance: function() {
      _instance = _instance || new Config();
      return _instance;
    }
  }

})();

module.exports = conf;