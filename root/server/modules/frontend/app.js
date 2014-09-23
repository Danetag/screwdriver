var path    = require('path');
var common  = require('./common');
var routes  = require('./routes');
var express = require('express');
var i18n    = require('i18n');
var fs      = require('fs');

var config  = common.config();
var pages   = common.pages();

var mod = (function() {

  var FrontEndModule = function() {

    this.app = null;
    this.aControllers = {};

    config.translationPath = __dirname + '/datas/translations/';
    config.baseLanguage    = "en";

  }

  FrontEndModule.prototype = {

    init: function(app) {

      this.app = app;

      initLanguages_.call(this);
      initEnv_.call(this);
      initControllers_.call(this);
      initViews_.call(this);
      initRoutes_.call(this);
      
    }

  }

  var initLanguages_ = function() {

    var languages = fs.readdirSync(config.translationPath);
    var self = this;

    config.aLang = [];

    languages.forEach(function(language) {
      config.aLang.push(language);
    });

  }

  var initEnv_ = function() {

    i18n.configure({locales:config.aLang})
    this.app.use(i18n.init);

    // Error
    if (config.display_error) {
      this.app.enable('verbose errors');  
    } else {
      this.app.disable('verbose errors');  
    }

    // Base url
    if (config.base_url === undefined) {
      config.base_url = "";
    }

  }

  var initControllers_ = function() {

    for (var i in pages) {

      var page = pages[i];

      var controller = require('./controllers/' + page.id + 'Controller');
      controller.init(page, config);

      this.aControllers[page.id] = controller;

    }

  }

  var initViews_ = function() {

    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'html');

    this.app.engine('html', require('express-dot').__express);

    // Device detection
    this.app.use(require('express-device').capture());

    // Static assets
    this.app.use(express.static(__dirname + '/../../..' + config.folder));
  }

  var initRoutes_ = function() {

    // Init the routes
    routes.init(config);

    // Set the controllers
    for (var i in routes.aRoutes) {

      var route = routes.aRoutes[i];

      route.controller = (route.controller != undefined ) ? route.controller : "index";
      route.action = (route.action != undefined ) ? route.action : "index";

      var controller = this.aControllers[route.controller];

      if (controller === undefined) {
        return new Error('The specified controller "'+ route.controller + 'Controller" doesn\'t exist');
      }

      route.controller = controller;

    }

    // Setup the routes
    routes.setupRoutes();

    // Finally, setup the router
    this.app.use(routes.router);

    // Since this is the last non-error-handling
    // middleware use()d, we assume 404, as nothing else
    // responded.
    // 404
    this.app.use(function(req, res, next){
      res.status(404);

      // respond with html page
      if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
      }

      // respond with json
      if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
      }

      // default to plain-text. send()
      res.type('txt').send('Not found');
    });


    // error-handling middleware, take the same form
    // as regular middleware, however they require an
    // arity of 4, aka the signature (err, req, res, next).
    // when connect has an error, it will invoke ONLY error-handling
    // middleware.

    // If we were to next() here any remaining non-error-handling
    // middleware would then be executed, or if we next(err) to
    // continue passing the error, only error-handling middleware
    // would remain being executed, however here
    // we simply respond with an error page.

    this.app.use(function(err, req, res, next){
      // we may use properties of the error object
      // here and next(err) appropriately, or if
      // we possibly recovered from the error, simply next().
      res.status(err.status || 500);
      res.render('500', { error: err });
    });

  }



  return FrontEndModule;

})();

module.exports = new mod();