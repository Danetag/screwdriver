var controller = (function() {

  var Controller = function() {
    this.page = null;
    this.config = null;
    this.lang = 'en';
    this.datas = {};
  }

  Controller.prototype = {

    init: function(page, config) {
      this.page = page;
      this.config = config;
    },

    preAction: function(req, res) {

      this.lang = req.params.lang;

      var baseUrl = req.protocol + '://' + req.get('host');

      // Base url
      if (this.config.base_url.length) {

        if (this.config.base_url[0] == '/') {
          baseUrl += his.config.base_url[0];
        }

        if (this.config.base_url.indexOf('http')) {
          baseUrl = this.config.base_url;
        }
        
      } 
        
      this.config.base_url = baseUrl;

      this.setBasicDatas(req);

    },

    postAction: function(req, res) {
      req.setLocale(this.lang);
    },

    setBasicDatas: function(req) {

      //Reset
      this.datas = null;
      this.datas = {};

      // First, get config datas
      for (var prop in this.config) {
        this.datas[prop] = this.config[prop];
      }

      // get translated datas
      var translatedDatas = require(this.config.translationPath + this.lang + '/' + this.page.id + '.json');
      for (var prop in translatedDatas) {
        this.datas[prop] = translatedDatas[prop];
      }

      // get device
      this.datas.device = req.device.type;
      this.datas.is_mobile = (this.datas.device == 'phone') ? true : false;

      // Lang
      this.datas.lang = this.lang;

      // Display layout?
      this.datas.layout = this.page.layout;

    }

  }


  return Controller;

})();

module.exports = controller;