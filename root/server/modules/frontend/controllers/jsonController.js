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

    for (var lang in Routes.aLangRoutes) {

      var aLangRoutes = Routes.aLangRoutes[lang];
      
      routes[lang] = {};

      for ( var i in aLangRoutes) {

        var route = aLangRoutes[i];

        if (!route.frontRouting) continue;

        routes[lang][route.id] = {};
        routes[lang][route.id].id = route.id;
        routes[lang][route.id].route = route.route;
      }

    }

    res.json(routes);
  }

  return JsonController;

})();

module.exports = new json();