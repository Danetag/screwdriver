var View    = require('dot-view').View,
    config  = require('getconfig'),
    Routes  = require('../routes');

var controller = (function() {

  var Controller = function() {
    this.page = null;
    this.lang = 'en';
    this.datas = {};
    this.id = null;
  }

  Controller.prototype = {

    init: function(id, page) {
      this.id = id;
      this.page = page;
    },

    preAction: function(req, res) {
      
      this.setBaseUrl(req);
      this.setBasicDatas(req);
      this.setPageDatas(req);
      this.setHeaders(req, res);
      this.setMenu(req);

    },

    postAction: function(req, res) {
      req.setLocale(this.lang);
    },

    setBaseUrl: function(req) {

      this.lang = req.params.lang;

      var baseUrl = req.protocol + '://' + req.get('host');

      // Base url
      if (config.frontend.base_url.length) {

        if (config.frontend.base_url[0] == '/') {
          baseUrl += config.frontend.base_url[0];
        }

        if (config.frontend.base_url.indexOf('http')) {
          baseUrl = config.frontend.base_url;
        }
        
      } 
      
      // Maybe wrong here :/
      config.frontend.root =  '';

      config.frontend.base_url = baseUrl;
    },

    setBasicDatas: function(req) {

      //Reset
      this.datas = null;
      this.datas = {};

      // First, get config datas
      for (var prop in config.frontend) {
        this.datas[prop] = config.frontend[prop];
      }

      // Lang
      this.datas.lang = this.lang;

      // Is dev ?
      this.datas.use_src = config.frontend.use_src;
      
      // get device
      this.datas.device = req.device.type;
      this.datas.is_mobile = (this.datas.device == 'phone') ? true : false;

      // Menu
      this.datas.routes = Routes.aLangRoutes;
      
    },

    setPageDatas: function(req) {

      if (this.page == null) return;

      // get translated datas
      var translatedDatas = require(config.frontend.translationPath + this.lang + '/' + this.page.id + '.json');
      for (var prop in translatedDatas) {
        this.datas[prop] = translatedDatas[prop];
      }

      // Display layout?
      if (this.page.hasLayout == undefined || this.page.hasLayout)
        this.datas.layout = new View(config.frontend.tplLayoutPath, 'layout.html', this.datas);

    },

    setHeaders: function(req, res) {

      if (this.page == null) return;

      var headers = req.headers['user-agent'];

      if (headers.indexOf('MSIE') > -1) {
        res.setHeader('X-UA-Compatible', 'IE=edge,chrome=1');
        this.datas.hasCompatibleMetaHeader = true;
      }
    },

    setMenu: function(req) {
      if (this.page == null) return;
    }

  }


  return Controller;

})();

module.exports = controller;