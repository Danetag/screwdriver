var express = require('express'),
    config  = require('getconfig'),
    fs      = require('fs');

var Routing = function() {

  this.router  = express.Router();
  this.aRoutes = [];

  this.translationRouteFile = 'translate_route.json';
  this.aLang = [];
  this.aLangRoutes = {};

}

Routing.prototype = {

  init: function() {

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

        for (var j in config.frontend.aLang) {
          var lang = config.frontend.aLang[j];
          this.setupRoute(route, lang);
        }

      }
      else {

        // No mutilangue in URL, use base language and put in the params
        this.setupRoute(route, config.frontend.baseLanguage);

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
      id: route.controller.id,
      label: _getLabel.call(this, lang, route.controller.id),
      datas: _getDatas.call(this, lang, route.controller.id),
      frontRouting: (route.frontRouting != undefined) ? route.frontRouting : true
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
  var words = require(config.frontend.translationPath + lang + "/" + this.translationRouteFile);
  return (words[word] !== undefined) ? words[word] : word;
}

var _getDatas = function(lang, id) {

  var path = config.frontend.translationPath + lang + "/" + id + '.json';

  if (!fs.existsSync(path)) {
    return null;
  }

  return require(path);
}

var _getLabel = function(lang, id) {

  var translateObj = _getDatas.call(this, lang, id);

  if (translateObj === null) {
    return id;
  }

  return (translateObj.label !== undefined) ? translateObj.label : id;
}


module.exports = Routing;