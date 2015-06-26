'use strict';

var EVENT               = require('event/event'),
    Config              = require('config/config'),
    CustomControlsView  = require('abstract/component/video/customControlsView'),
    YTPlayerTpl         = require('components/YTPlayer.html');

/**
 * YTPlayer: Youtube player
 * @extend {Backbone.Events}
 * @constructor
 */
var YTPlayer = function (){

  this.template = YTPlayerTpl;

  this.config = {};

  this.player = null;

  this.isPlaying = false;
  this.noRAF = false;
  this.hasBeenPlayed = false;
  this.isInit = false;
  this.isInitializing = false;
  this.wasPlaying = false;

  this.quality = 100;
  this.state = 0;

  this.$playButton = null;
  this.touchThisClass = "touch-this-to-start";
  this.customControlsView = null;

  this.currentTime = 0;

  // protection from mouse move/click
  this.isAClick = true;

  Backbone.View.call(this);

}

_.extend(YTPlayer, Backbone.View);
_.extend(YTPlayer.prototype, Backbone.View.prototype);


YTPlayer.prototype.init = function(config_) {

  this.config = config_;

  // console.log('YTPlayer.prototype.init', config_);

  if (this.config.$container == undefined) {
    console.log("YTPlayer:: Please provide a $container");
    return null;
  }

  if (this.config.youtubeID == undefined) {
    console.log("YTPlayer:: Please provide a youtubeID");
    return null;
  }

  if (this.config.$playButton != undefined) {
    this.$playButton = this.config.$playButton;    
  } 

  // custom player by default
  //if (this.config.customPlayer == undefined)
   // this.config.customPlayer = true;

  // No custom controls
  if (Config.isOldIE) 
    this.config.customPlayer = false;
  

  this.quality = this.config.quality || 100;

  _createContainer.call(this);

  // if( Detectizr.device.type == 'tablet' || Detectizr.browser.name == "firefox"){
  //   this.config.customPlayer = undefined;
  // }

  _createCustomControls.call(this);

  _bindEvents.call(this);

  if (this.config.noInit == undefined || !this.config.noInit)
    _initPlayer.call(this);
  else
    this.trigger(EVENT.READY);
  

}

YTPlayer.prototype.stopAllMedia = function(id_) {
  if (id_ != this.config.youtubeID) {
    this.pause();
  }
}

YTPlayer.prototype.togglePlay = function() {
  if (!this.isPlaying) this.play();
  else this.pause();
}

YTPlayer.prototype.changeSrc = function(videoID_) {

  if (videoID_ == this.config.youtubeID) return;

  // console.log('--YTPlayer.prototype.changeSrc ::', videoID_, this.player);

  this.config.youtubeID = videoID_;
  
  this.currentTime = 0;
  this.noRAF = true;
  this.wasPlaying = false;

  _showPlayButton.call(this);

  if (Detectizr.device.type != "desktop" && !Config.isIE) {

    //_showPoster.call(this);

    //if (this.player != null)

    _destroy.call(this); //destroy anyway
    
    return;
  } 

  if (this.player != null && this.isInit) {

    if (this.player.loadVideoById == undefined) {
      _destroy.call(this);
    } else {
      this.player.loadVideoById(videoID_);
      this.player.pauseVideo();
    }

    
  }
    
}

YTPlayer.prototype.play = function() {

  if (this.player == null || !this.isInit || this.isBuffering || this.isPlaying ) return;

  if (Detectizr.device.type == "tablet" && this.hasBeenPlayed == false && !this.isInit) {
    
    // console.log("we are tablet... cant autoplay video for first time.");
    // but try any way:
    //this.player.playVideo();
    this.$el.addClass(this.touchThisClass);
    _initPlayer.call(this);

  } else{

    // console.log(' PLAY VIDEO ');
  
    
    try{
      this.player.playVideo();
    }catch(err){
      console.log(" ------ play error: " , err );
      _destroy.call(this);
    }
    
  }
}


YTPlayer.prototype.pause = function() {

  // console.log('TRY TO YTPlayer.prototype.pause');

  if (this.player == null || !this.hasBeenPlayed || !this.isInit || this.isBuffering || !this.isPlaying || !this.wasPlaying) return;

  //_showPlayButton.call(this);

  // console.log('YTPlayer.prototype.pause');

  try{
    this.player.pauseVideo();
  }catch(err){
    console.log("------ pause video error " , err);
    _destroy.call(this);
    //return;
  }


  
}

YTPlayer.prototype.resume = function() {

  if (this.player == null || this.state != "2" || !this.isInit || !this.wasPlaying) return;

  // console.log('YTPlayer.prototype.resume');

  this.play();
}

YTPlayer.prototype.stop = function() {

  if (this.player == null || !this.isInit) return;

  //_showPlayButton.call(this);

  this.player.stopVideo();
}

YTPlayer.prototype.currentTime = function(time){

  if (this.player == null || !this.isInit) return;

  if(time != undefined)
    this.player.seekTo(time);
  else
    return this.player.getCurrentTime();
}

YTPlayer.prototype.bufferedPercent = function(){

  if (this.player == null || !this.isInit) return;

  return this.player.getVideoLoadedFraction();
}

YTPlayer.prototype.onSeek = function(e){

  if (this.player == null || !this.isInit) return;

  var currentTime = this.duration * e.pct;
  this.player.seekTo(currentTime);
}


YTPlayer.prototype.onUpdate = function() {

  if (this.player == null || !this.isInit) {

    if (!this.noRAF)
      window.requestAnimationFrame(this.onUpdate.bind(this));

    return;
  }

  //console.log('YTPlayer.prototype.onUpdate', this.config.youtubeID);

  //get currentTime 
  try {
    this.currentTime = this.player.getCurrentTime();
  }catch(err) {
    //console.log("----- ytPlayer onUpdate er: ", err );
  }

  _updateCustomControls.call(this);

  if (!this.noRAF)
    window.requestAnimationFrame(this.onUpdate.bind(this));
}


YTPlayer.prototype.dispose = function () {

  this.noRAF = true; //stop RAF

  if (this.player != null)
    this.player.destroy();

  this.player = null;

  if (this.customControlsView != null) {
    _unbindCustomControlsEvents.call(this);
    this.customControlsView.dispose();
  }
    
  this.customControlsView = null;

  _unbindEvents.call(this);

  this.config.$poster = null;
  this.config.$container = null;
  this.config.$playButton = null;
  this.$playButton = null;

  this.config = null;

  this.remove();
}

var _destroy = function(showPoster_) {

  var showPoster = (showPoster_ != undefined) ? showPoster_ : true;

  console.log('!!!!something went wrong with the YTPayer.Re-INIT :', this.config.videoID);

  this.isInit = false;
  this.hasBeenPlayed = false;
  this.wasPlaying = false;

  if (this.player != null)
    this.player.destroy();

  this.player = null;

  if (showPoster)
    _showPoster.call(this);

  // console.log('this.config.$container', this.config.$container);
  // console.log('this.$el', this.$el);

  //this.config.$container.find('.yt-player').remove();

  // SHould be the same, anyway...
  this.remove();
  this.$el.remove();

  // hack to force the video source
  this.config.id = this.config.youtubeID;

  setTimeout($.proxy(function(){
    //console.log('before creating, the id is suppose to be :', this.config.youtubeID);
    _createContainer.call(this);
  }, this), 0);

}


/* Custom Controls */

var _createCustomControls = function() {

  // If we don't want a custom one by default
  
  if (this.config.customPlayer != undefined && !this.config.customPlayer) return;

  this.customControlsView = new CustomControlsView();
  this.customControlsView.init({$container: this.config.$container});
  this.customControlsView.show(); // maybe use later

  _bindCustomControlsEvents.call(this);
}


var _bindCustomControlsEvents = function() {
  this.listenTo(this.customControlsView, EVENT.ON_FULLSCREEN, this.play.bind(this));
  this.listenTo(this.customControlsView, EVENT.ON_TOGGLE_PLAY, this.togglePlay.bind(this));
  this.listenTo(this.customControlsView, EVENT.ON_SEEK, this.onSeek.bind(this));
}

var _unbindCustomControlsEvents = function() {
  this.stopListening(this.customControlsView, EVENT.ON_FULLSCREEN, this.play.bind(this));
  this.stopListening(this.customControlsView, EVENT.ON_TOGGLE_PLAY, this.togglePlay.bind(this));
  this.stopListening(this.customControlsView, EVENT.ON_SEEK, this.onSeek.bind(this));
}

var _updateCustomControls = function() {

  if (this.customControlsView == null || !this.duration) return;

  //console.log('this.currentTime / this.duration', this.currentTime / this.duration, this.currentTime, this.duration);

  this.customControlsView.setCurrentPctPlayed(this.currentTime / this.duration);
}

/**
 * Generate the DOM element based on the provided template.
 */
var _createContainer = function(id_) {

  var id = (id_ != undefined) ? id_ : this.config.id;
  this.config.id = id;

  //console.log('_createContainer', id, 'id_', id_);

  this.el  = Mustache.render(this.template, {id:id});
  this.$el = $(this.el);

  this.config.$container.append(this.$el);
}


var _bindEvents = function() {

  if (this.config.$poster != undefined) {
    this.config.$poster.on('click', $.proxy(_onPosterClick, this));
  }

  if (this.$playButton != null) {
    this.$playButton.on('click',  $.proxy(_onPosterClick, this));
  }

}

var _unbindEvents = function() {
  
  if (this.config.$poster != undefined) {
    this.config.$poster.off('click', $.proxy(_onPosterClick, this));
  }

  if (this.$playButton != null) {
    this.$playButton.off('click', $.proxy(_onPosterClick, this));
  }

}

var _initPlayer = function() {

  if (this.isInitializing) return;

  this.isInitializing = true;

  // console.log('_initPlayer', this.config.videoID);

  if (this.player != null)
    _destroy.call(this, false);

  if (this.config.$poster != undefined)
    _hidePlayButton.call(this);
  
  var controls = 0;

  if( this.config.customPlayer !== undefined && !this.config.customPlayer){
    controls = 1;
  }

  // console.log('this.config.customPlayer', this.config.customPlayer, controls);

  // id is a name value for the id tag of the video.
  var id = this.config.id || this.config.youtubeID;
  
  var ytDefaults = { 
    'autoplay': 0, 
    'controls': controls,
    'showinfo' : 0,
    'modestbranding' : 1,
    'iv_load_policy' : 3
  };

  // console.log('gonna init the player with ', this.config.youtubeID);

  this.player = new YT.Player('yt-player-' + id, {
    height     : this.config.height || "100%",
    width      : this.config.width  || "100%",
    videoId    : this.config.youtubeID,
    playerVars : this.config.playerVars || ytDefaults,
    events: {
      'onReady'      : $.proxy(_onReady, this), 
      'onStateChange': $.proxy(_onPlayerStateChange, this),
      'onPlaybackQualityChange' : $.proxy(_onPlaybackQualityChange, this),
      'onError'      : $.proxy(_onError, this)
    }
  });

}

var _onReady = function(e) {

  // console.log('_onReady', this.config.videoID);

  this.player.setPlaybackQuality(this.quality);

  this.isInit = true;
  this.isInitializing = false;

  if (this.config.noInit == undefined || !this.config.noInit)
    this.trigger(EVENT.READY);
  else if (Detectizr.device.type == "desktop" || Config.isIE)
    this.play();
  else
    _hidePoster.call(this); //tablet
}

var _onPlayerStateChange = function(e) {

  this.state = e.data;
  this.trigger(EVENT.STATE_CHANGE, e);

  /*
     -1 (unstarted)
      0 (ended)
      1 (playing)
      2 (paused)
      3 (buffering)
      5 (video cued)..
  */

  // console.log('YTPlayer:: StateChanged : ', this.state);

  this.isBuffering = false;
    
  switch( this.state ) {

    //unstarted
    case -1 : this.isPlaying = false; break;

    //ended
    case 0  : this.noRAF = true;
              this.isPlaying = false;
              _showPlayButton.call(this); 
              _showPoster.call(this);
              this.trigger(EVENT.ON_END, {mediaID: this.config.youtubeID});
              break;

    //loaded (playing)
    case 1  : this.noRAF = false;
              this.isPlaying = true;
              this.wasPlaying = true;

              //TODO: Verify this works on tablet and remove try catch
              try {
                this.duration = this.player.getDuration();
              }catch(err) {      
                console.log(' ---- get duration failed.');
              }

              // TODO: verify this works again. this breaks on tablet onUpdate():
              this.onUpdate();
              this.hasBeenPlayed = true; 
              console.log('------- play loaded: ' + this.hasBeenPlayed );
              
              this.trigger(EVENT.ON_PLAY, {mediaID: this.config.youtubeID});
              //this.trigger(EVENT.ON_PLAY);
              _hidePlayButton.call(this); 

              break;

    //paused
    case 2  : //this.trigger(EVENT.ON_PAUSE);
              this.trigger(EVENT.ON_PAUSE, {mediaID: this.config.youtubeID});
              this.wasPlaying = false;
              this.isPlaying = false;
              _showPlayButton.call(this); break;

    //buffering
    case 3  : this.isPlaying = false; _onBuffering.call(this); break; 
  }


}

var _onPlaybackQualityChange = function(e) {
  this.quality = e.data;
  this.trigger(EVENT.QUALITY_CHANGE, e);
}

var _onError = function(e) {
  switch(e.data){
      case 2   : console.log("Youtube Error :: The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks."); break;
      case 5   : console.log("Youtube Error :: The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred."); break;
      case 100 : console.log("Youtube Error :: The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private."); break;
      case 101 : console.log("Youtube Error :: The owner of the requested video does not allow it to be played in embedded players."); break;
      case 150 : console.log("Youtube Error :: This error is the same as 101. It's just a 101 error in disguise!"); break;
  }
}

var _onBuffering = function() {

  console.log('_onBuffering');
  console.log(' ----- buffering what ' + Detectizr.device.type );

  this.isBuffering = true;

  if (Detectizr.device.type != "desktop"  && !Config.isIE) {
    console.log(' --- remove z-index now that we have activated this video to play.');
    
    this.$el.removeClass(this.touchThisClass);
    if( this.config.$container ){
      this.config.$container.removeClass(this.touchThisClass);
    }
  }


  if (!this.hasBeenPlayed) {
    
    // ERROR HERE:  
    try {
      this.duration = this.player.getDuration();
    }catch(err) {
      console.log('\n _onBuffering errrorrrrr- \n', err );
      _destroy.call(this);
      //return;
    }

    // start the raf
     this.onUpdate();

    _hidePoster.call(this);
    //_hidePlayButton.call(this);
    //this.hasBeenPlayed = true;

  }


}

/* Poster */

var _onPosterClick = function(e) {

  if(!this.isAClick || this.isInitializing || this.isBuffering) return;

  console.log('_onPosterClick');

  // dirty hack for scrollbar...
  //if (Detectizr.os.name == "windows") 
  Config.mainView.forceResize();

  //this.config.$poster.off('click', $.proxy(_onPosterClick, this));

  if (this.hasBeenPlayed && this.isInit) {
    console.log('go play', 'this.hasBeenPlayed ', this.hasBeenPlayed , 'this.isInit', this.isInit);
    _hidePoster.call(this);
    this.play();
  } else {

    //if (Detectizr.device.type == "desktop") {
      if (this.config.noInit == undefined || !this.config.noInit) {
        console.log('PLAY!');
        this.play();
      } else if ( (Detectizr.device.type == "desktop" || Config.isIE ) && this.isInit) {
        console.log('HIDE POSTER!');
        _hidePoster.call(this);
      } else {
        console.log('init pepouz');
        _hidePoster.call(this);
        _initPlayer.call(this);
      }
   // }
    
  }
  
  
}

var _hidePoster = function() {

  if (this.config.$poster == undefined) return;

  TweenLite.to(this.config.$poster, .3, {autoAlpha:0, ease: Cubic.easeOut});
}

var _showPoster = function() {
  // console.log("show poster......");
  if (this.config.$poster == undefined) return;
  
  this.$el.removeClass(this.touchThisClass);

  TweenLite.to(this.config.$poster, .3, {autoAlpha:1, ease: Cubic.easeOut});
}

var _hidePlayButton = function() {

  //console.log('_hidePlayButton');

  _showCustomControls.call(this);

  if (this.$playButton == null) return;

  //setTimeout($.proxy(function(){
    this.$playButton.addClass('hide');
  //}, this), 300);
  

}

var _showPlayButton = function() {

  // console.log('_showPlayButton');

  _hideCustomControls.call(this);

  if (this.$playButton == null) return;

  if( Detectizr.device.type == 'tablet' ){
    //this.$el.removeClass(this.touchThisClass);
    //return;
  }

  setTimeout($.proxy(function(){
    this.$playButton.removeClass('hide');
  }, this), 300);

}


var _showCustomControls = function() {

  if (this.customControlsView == null) return;

  this.customControlsView.showPause();
  this.customControlsView.initPlay();
}

var _hideCustomControls = function() {
  
  if (this.customControlsView == null) return;

  this.customControlsView.hidePause();

}

module.exports = YTPlayer;