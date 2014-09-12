var express = require('express');


var routing = (function() {

  var Routing = function() {

    this.router  = express.Router();
    this.aRoutes = [];

    this.translationRouteFile = 'translate_route.json';
    this.aLang = [];
    this.aLangRoutes = {};

  }

  Routing.prototype = {

    init: function(config) {

      this.config = config;

      this.initRoutes();
      this.initPreMiddlewares();
      this.initPostMiddlewares();

    },

    /* To override */
    initPreMiddlewares: function() {

    },

    /* To override */
    initRoutes: function() {

    },

    /* To override */
    initPostMiddlewares: function() {

    },

    addRoutes: function(routes) {
      for (var i in routes) {
        this.addRoute(routes[i]);
      }
    },

    addRoute: function(routeObject) {
      this.aRoutes.push(routeObject);
    },

    setupRoutes: function() {

      // Routes
      for (var i in this.aRoutes) {

        var route = this.aRoutes[i];

        // Handle the multilangue here
        if (route.lang !== undefined && route.route.indexOf(route.lang) !== -1) {

          for (var j in this.config.aLang) {
            var lang = this.config.aLang[j];
            this.setupRoute(route, lang);
          }

        }
        else {

          // No mutilangue in URL, use base language and put in the params
          this.setupRoute(route, this.config.baseLanguage);

        }
       
      }

    },

    setupRoute: function(route, lang) {

      if (this.aLangRoutes[lang] === undefined) {
        this.aLangRoutes[lang] = [];
      }
      
      var actionMethod = route.action + "Action";
      var url = route.route;

      // Lang
      url = url.replace(':@lang', lang);

      // Has params to translate ?
      var re = /(:@+[a-zA-Z])\w+/g;
      var aTranslateWord = url.match(re);

      if (aTranslateWord != null) {

        // Replace url
        for (var i in aTranslateWord) {

          var word = aTranslateWord[i].replace(':@', '');

          //get translation
          var tWord = _getTranslation.call(this, lang, word);
          url = url.replace(aTranslateWord[i], tWord);

        }

      } 

      var rt = {
        route: url,
        id: route.controller.page.id
      };

      this.aLangRoutes[lang].push(rt);

      // Finally, add a new route
      this.router.get(url, function(req, res) {

        req.params.lang = lang;

        route.controller.preAction(req, res);
        route.controller[actionMethod](req, res); // Ugly though.
        route.controller.postAction(req, res);

      });

    }


  }

  var _getTranslation = function(lang, word) {
    var words = require(this.config.translationPath + lang + "/" + this.translationRouteFile);
    return (words[word] !== undefined) ? words[word] : word;
  }

  return Routing;

})();

module.exports = routing;