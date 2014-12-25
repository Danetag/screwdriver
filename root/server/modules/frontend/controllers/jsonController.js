var controller  = require('../../../core/Controller'),
    Routes      = require('../routes');

var json = (function() {

  var JsonController = function() {
    controller.call(this);
  }

  JsonController.prototype = Object.create(controller.prototype);
  JsonController.prototype.constructor = JsonController;

  JsonController.prototype.preAction = function(req, res) {
    this.setBaseUrl(req);
    res.setHeader('Content-Type', 'application/json');
  }

  JsonController.prototype.routesAction = function(req, res) {

    var routes = {};
    routes.all = {};
    routes.pages = {};

    for (var lang in Routes.aLangRoutes) {

      var aLangRoutes = Routes.aLangRoutes[lang];
      
      routes.all[lang] = {};
      routes.pages[lang] = {};

      for ( var i in aLangRoutes) {

        var route = aLangRoutes[i];

        if (!route.frontRouting) continue;

        routes.all[lang][route.id] = {};
        routes.all[lang][route.id].id = route.id;
        routes.all[lang][route.id].route = route.route;

        // remove lang from route
        var backboneRoute = route.route.replace('/' + lang + '/', '');

        //remove last slash
        if (backboneRoute[backboneRoute.length - 1] == '/') backboneRoute = backboneRoute.substr(0, backboneRoute.length - 1);
        if (backboneRoute == '/' + lang || backboneRoute == '') continue;

        routes.pages[lang][backboneRoute] = route.id;
      }

    }

    res.json(routes);
  }

  return JsonController;

})();

module.exports = new json();