var controller  = require('../core/Controller'),
    config      = require('getconfig'),
    Routes      = require('../routes');

var JsonController = function() {
  controller.call(this);
}

JsonController.prototype = Object.create(controller.prototype);
JsonController.prototype.constructor = JsonController;

JsonController.prototype.preAction = function(req, res) {
  this.setBaseUrl(req);
  this.setBasicDatas(req);
  res.setHeader('Content-Type', 'application/json');
}

JsonController.prototype.routesAction = function(req, res) {

  var routes = {};

  //mainpage
  routes.mainpage = Routes.aLangRoutes.mainpage;

  for (var lang in Routes.aLangRoutes) {

    if (lang == "mainpage") continue;

    var aLangRoutes = Routes.aLangRoutes[lang];
    
    routes[lang] = {};

    for ( var i in aLangRoutes) {

      var route = aLangRoutes[i];

      if (!route.frontRouting) continue;

      routes[lang][route.id] = {};

      // Copying properties
      for (var property in route) {
        routes[lang][route.id][property] = route[property];
      }

      // Complete the datas
      routes[lang][route.id].datas.lang = lang;
      routes[lang][route.id].datas.base_url = config.frontend.base_url;

      // remove lang from route
      var backboneRoute = route.route.replace('/' + lang + '/', '');

      //remove last slash
      if (backboneRoute[backboneRoute.length - 1] == '/') backboneRoute = backboneRoute.substr(0, backboneRoute.length - 1);
      if (backboneRoute == '/' + lang || backboneRoute == '') continue;

    }

  }

  res.json(routes);

}


module.exports = new JsonController();