var express = require('express'),
    config  = require('getconfig'),
    _       = require('underscore'),
    fs      = require('fs');

var Routing = function() {

  this.router  = express.Router();
  this.aRoutes = [];

  /* Contain all the config for each page */
  this.pages   = require('../datas/pages.json');

  this.translationRouteFile = '_slug.json';
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

    // mainPage

    this.aLangRoutes.mainpage = _getConfigPage.call(this, 'mainpage');

  },

  setupRoute: function(route, lang) {

    if (this.aLangRoutes[lang] === undefined) {
      this.aLangRoutes[lang] = [];
    }
    
    var actionMethod = route.action + "Action";
    var url = _getUrl.call(this, route, lang);

    //console.log('url', url);

    var rt = {
      route: url,
      id: route.controller.id,
      slug: route.slug,
      label: _getLabel.call(this, lang, route.controller.id),
      datas: _getDatas.call(this, url),
      isLoaded: false,
      frontRouting: (route.frontRouting != undefined) ? route.frontRouting : true
    };

    _mergeConfig.call(this, rt);
    
    this.aLangRoutes[lang].push(rt);

    // Finally, add a new route
    this.router.get(url, function(req, res) {

      req.params.lang = lang;

      route.controller.preAction(req, res);
      route.controller[actionMethod](req, res); // Ugly though.
      route.controller.postAction(req, res);
    });

    // json version, get the datas
    this.router.get(url + ".json", function(req, res) {

      req.params.lang = lang;

      route.controller.preAction(req, res);
      route.controller.getDatasAction(req, res);
      route.controller.postAction(req, res);
    });

  }


}

var _getUrl = function(route_, lang_) {

  // Lang
  var url = route_.route.replace(':@lang', lang_);

  // Has params to translate ?
  var re = /(:@+[a-zA-Z])\w+/g;
  var aTranslateWord = url.match(re);

  if (aTranslateWord != null) {

    // Replace url
    for (var i in aTranslateWord) {

      var word = aTranslateWord[i].replace(':@', '');

      //get translation
      var tWord = _getTranslation.call(this, lang_, word);
      url = url.replace(aTranslateWord[i], tWord);

      // last one
      if (i == aTranslateWord.length - 1) {
        route_.slug = tWord;
      }

    }

  } else {
    route_.slug = url.replace('/', '');//route_.controller.id;
  }

  // remove slash at the end in case
  if (url[url.length-1] == "/")
    url = url.substr(0, url.length - 1);

  return url;

}

var _mergeConfig = function(rt_) {

  var configPage = _getConfigPage.call(this, rt_.id);

  for (var property in configPage) {

    if (!rt_.hasOwnProperty(property)) {
      rt_[property] = configPage[property];
    }

  }

  if (rt_.parent == undefined)
    rt_.parent = null;

  //rt_.slug = (rt_.datas != null) ? rt_.datas.slug : rt_.id;
  
}

var _getConfigPage = function(id_) {

  for (var i in this.pages.pages) {
    var page = this.pages.pages[i];

    //console.log('page', page, 'id_', id_);

    if (page.id == id_) return page;
  }

  return null;

}

var _getTranslation = function(lang, word) {
  var words = require(config.frontend.translationPath + lang + "/" + this.translationRouteFile);
  return (words[word] !== undefined) ? words[word] : word;
}

var _getDatas = function(url) {

  return url + '.json';

  /*

  var path = config.frontend.translationPath + lang + "/" + id + '.json';

  if (!fs.existsSync(path)) {
    return null;
  }

  return require(path);
  */
}

var _getLabel = function(lang, id) {

  var translateObj = _getDatas.call(this, lang, id);

  if (translateObj === null) {
    return id;
  }

  return (translateObj.label !== undefined) ? translateObj.label : id;
}


module.exports = Routing;