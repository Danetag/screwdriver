'use strict';

var $               = require('jquery'),
    AbstractView    = require('abstract/view'),
    Backbone        = require('backbone'),
    Config        = require('config/config')


var AbstractLoaderView = AbstractView.extend(new function (){

    /*
     * Percent of the current Loader
     * @type {number}
     */
    this.pct = 0;

    /*
     * Loader container
     * @type {$}
     */
    this.$loader = null;

    this.setPct = function(pct) {
        this.pct = pct;
    }

    this.render = function() {

        this.initEL();

        var el = null;

        try {
            el = this.template();
        } catch(err) {
            console.log('You have to provide a loader template');
            return;
        }

        this.$loader = $(el);
        this.$el.prepend(this.$loader);

        this.initDOM();
        this.fixImgSrc();

    }

    this.initEL = function() {
        this.$el = $('body');
    }

    this.initDOM = function() {
        
    }

    this.fixImgSrc = function() {

        var c = Config.getInstance();
        var $imgs = this.$el.find('img');

        if (!$imgs.length) return;

        $.each($imgs, function(i, img){

          var $img = $(img);
          var src =  $img.attr('src');

          if (src.indexOf(c.patternPHPBaseUrl) > -1) {
            
            var idx = src.indexOf(c.patternPHPBaseUrl);

            var i = 0;
            var j = 0;
            
            while (src.substr(idx + i, c.patternPHPEnd.length) != c.patternPHPEnd) i++;
            while (src.substr(idx - j, c.patternPHPStart.length) != c.patternPHPStart) j++;

            var match = src.substring(idx - j, idx + i + c.patternPHPEnd.length);
            src = src.replace(match, c.baseUrl);

            $img.attr("src", src);
          }

        });
      }

    this.dispose = function() {
        this.unbindEvents();
        this.destroyTL();
        
        if(this.$loader != null) this.$loader.remove();
        this.$loader = null;
    }

});

module.exports = AbstractLoaderView;