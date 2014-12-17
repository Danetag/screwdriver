'use strict';

var $                     = require('jquery'),
    EVENT                 = require('event/event'),
    AbstractPageView      = require('abstract/page/pageView'),
    _                     = require('underscore'),
    Config                = require('config/config'),
    Backbone              = require('backbone');

var Popin = AbstractPageView.extend(new function (){
  
  /*
   * template
   * @type {_.template}
   */
  this.template = null;

  this.initialize = function(options) {
    this.template = _.template(options.tpl);
    AbstractPageView.prototype.initialize.call(this, options);
  }

  this.initPlayer = function(){

    var player = {
    playVideo: function(container, videoId) {
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
          window.onYouTubeIframeAPIReady = function() {
            player.loadPlayer('player', 'TrJPKT-_VV0');
          };

         // 2. This code loads the IFrame Player API code asynchronously.
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        } else {
          player.loadPlayer('player', 'TrJPKT-_VV0');
        }
      },

      loadPlayer: function(container, videoId) {
        new YT.Player(container, {
          videoId: videoId,
          width: 500,
          height: 300,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showInfo: 0
          }
        });
      }
    };

    player.playVideo();

        function onPlayerReady(event) {
          event.target.playVideo();
        }

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        var done = false;
        function onPlayerStateChange(event) {
          if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
          }
        }
        function stopVideo() {
          player.stopVideo();
        }

  }


});


module.exports = Popin;