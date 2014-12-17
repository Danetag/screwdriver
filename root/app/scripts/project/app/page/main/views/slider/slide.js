var Tools         = require('tools/tools'),
    SLIDER_CONST  = require('page/main/views/slider/const'),
    EVENT         = require('event/event'),
    _             = require('underscore'),
    Backbone      = require('backbone'),
    $             = require('jquery');

var S = (function() {

  var Slide = function(options) {

    PIXI.DisplayObjectContainer.call(this);

    _.extend(this, Backbone.Events);

    this.id = options ? options.id : "";
    this.title = options ? options.title : "";
  	this.subtitle = (options.subtitle != undefined) ? options.subtitle : "";
    this.url = options ? options.url : "";
    this.index = options ? options.index : "";
    this.tutorial = options ? options.tutorial : "" ;
    this.coverAsset = options ? options.coverAsset : null ;
    this.coverBlurAsset = options ? options.cover_blur : null ;
    this.alphaBG = options ? options.alphaBG : .5;

    this.interactionsAssets = this.getAssetsFromID("interaction",options.assets);

    this.type = SLIDER_CONST.TYPE;
    this.COVER = this.id + "_cover";
    this.COVER_BLUR = this.id + "_coverBlur";

    /* Coords object for click detection */
    this.clickCoords = {};
    this.deltaClick = 2;

    /* Shown/Hidden callback functions */
    this.shownCallback = null;
    this.hiddenCallback = null;

    /* Sprite */
    this.circleSprite = null;
    this.handSprite   = null;
    this.coverSprite  = null;
    this.coverSpriteBlur = null;

    /* Container */
    this.coverContainer  = null;
    this.circleContainer = null;

    this.hasBeenShownOnce = false;

    this.maskCover = null;
    
  	this.interactive = true;
  	this.renderable = true;

  	this.position.x = 0;
  	this.position.y = 0;

    this.scale.x = this.scale.y = 1;

  }

  Slide.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
  Slide.prototype.constructor = Slide;

  Slide.prototype.bindEvents = function() {
    //this.circleContainer.click = $.proxy(this.displayInteraction, this);
    this.circleContainer.mousedown = this.circleContainer.touchstart = $.proxy(this.circleMouseDownHandler, this);
    this.circleContainer.mouseup   = this.circleContainer.touchend =  $.proxy(this.circleMouseUpHandler, this);
  }

  Slide.prototype.circleMouseDownHandler = function(data){

    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this).x;
    this.clickCoords.y = data.getLocalPosition(this).y;

  }

  Slide.prototype.circleMouseUpHandler = function(data){

    var endClickCoordX = data.getLocalPosition(this).x;
    var endClickCoordY = data.getLocalPosition(this).y;

    //Check if click or drag 
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick ){
      this.clickMenuHandler(data);
    }
  }

  Slide.prototype.clickMenuHandler = function(data){

    this.trigger(EVENT.DISPLAY_INTERACTION, {interaction:this.capitaliseFirstLetter(this.id)});
    this.toggleCircle();
    this.toggleBackground(false);

  }

  Slide.prototype.capitaliseFirstLetter=function(string)
  {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  Slide.prototype.render = function(){

  	this.coverContainer  = new PIXI.DisplayObjectContainer();
  	this.circleContainer = new PIXI.DisplayObjectContainer();
    this.circleContainer.interactive = true;

    PIXI.TextureCache[this.COVER]      = new PIXI.Texture(new PIXI.BaseTexture(this.coverAsset));
    PIXI.TextureCache[this.COVER_BLUR] = new PIXI.Texture(new PIXI.BaseTexture(this.coverBlurAsset));
    //cache the interaction texture here to use later
    this.cacheAssets(this.interactionsAssets);

    // create a new Sprite using the texture
    this.coverSprite     = new PIXI.Sprite(PIXI.TextureCache[this.COVER]);
    this.coverSpriteBlur = new PIXI.Sprite(PIXI.TextureCache[this.COVER_BLUR]);

    this.coverSprite.cacheAsBitmap = true;
    this.coverSpriteBlur.cacheAsBitmap = true;
    this.coverSpriteBlur.alpha = 0;

    this.coverContainer.addChild(this.coverSprite);
    this.coverContainer.addChild(this.coverSpriteBlur);
    
    //CIRCLE
    this.circleContainer.width = PIXI.TextureCache['circle'].width;
    this.circleContainer.height = PIXI.TextureCache['circle'].height;

    this.circleSprite = new PIXI.Sprite(PIXI.TextureCache['circle']);
    this.circleSprite.width = PIXI.TextureCache['circle'].width;
    this.circleSprite.height = PIXI.TextureCache['circle'].height;
    this.circleSprite.scale.x = .5;
    this.circleSprite.scale.y = .5;
    this.circleSprite.anchor.x = 0.5;
    this.circleSprite.anchor.y = 0.5;
    this.circleSprite.position.x = 50;
    this.circleSprite.position.y = 50;
    this.circleSprite.alpha = 0;
    this.circleSprite.cacheAsBitmap = true;

    this.circleContainer.addChild(this.circleSprite);

    //HAND
    this.handSprite = new PIXI.Sprite(PIXI.TextureCache['hand']);
    this.handSprite.width = PIXI.TextureCache['hand'].width;
    this.handSprite.height = PIXI.TextureCache['hand'].height;
    this.handSprite.position.x = 50;
    this.handSprite.position.y = 50;
    this.handSprite.anchor.x = 0.5;
    this.handSprite.anchor.y = 0.5;
    this.handSprite.scale.x = .5;
    this.handSprite.scale.y = .5;
    this.handSprite.alpha = 0;
    this.handSprite.cacheAsBitmap = true;

    this.circleContainer.addChild(this.handSprite);

    
    //this.coverContainer.mask = new PIXI.Graphics();

    // Masks
    //this.mask = new PIXI.Graphics();
    this.maskCover = new PIXI.Graphics();
    this.maskCover.boundsPadding = 0;
    //this.maskCover.position.x = 0;
    
    this.coverContainer.mask = this.maskCover;
    
    // Add to the stage
   	this.addChild(this.coverContainer);
    this.addChild(this.circleContainer);
    this.addChild(this.maskCover);

    this.bindEvents();

    //this.resize();

    //need to move to top level
    //if(this.index === 0) this.toggleCircle(true);

    //console.log('RENDER:: this.width', this.width)


  }

  Slide.prototype.show = function(menuToggled) {
    this.toggleCircle(!menuToggled);
  }

  Slide.prototype.hide = function() {
    this.toggleCircle(false);
  }

  Slide.prototype.update = function() {
  	
  };

  Slide.prototype.toggleCircle = function(state){

    var scale  = state ? 1 : .5;
    var alpha  = state ? 1 : 0;
    var easing = state ? Back.easeOut : Back.easeIn;
    var onComplete = state ? this.shownCallback : this.hiddenCallback;

    this.hasBeenShownOnce = true;

    this.circleContainer.interactive = state;

    //hide circle
    TweenMax.to(this.handSprite.scale,.5,{x:scale,y:scale,ease : easing ,delay: state ? .2 : 0});
    TweenMax.to(this.handSprite,.5,{alpha : alpha ,delay: state ? .2 : 0});
    TweenMax.to(this.circleSprite.scale,.5,{x:scale,y:scale,ease : easing ,delay: state ? 0 : .2});
    TweenMax.to(this.circleSprite,.5,{alpha : alpha, onComplete: onComplete, onCompleteParams:[{sprite:this}], delay: state ? 0 : .2});
  }

  Slide.prototype.toggleBackground = function(state,alpha){
    var alpha = state ? 1 : this.alphaBG;
    console.log(this);
    TweenMax.to(this.coverContainer,.5,{alpha : alpha});
  }

  Slide.prototype.redraw = function(viewport) {
    
  }

  Slide.prototype.getAssetsFromID = function(ID,assets) {

    var aAssets = {};

    for (var name in assets) {

      var asset = assets[name];
      // Has to be at the beginning
      if (name.indexOf(ID + "_") === 0 ) {

        var currentId = ID + "_";
        var id = name; // we remove the first part
        aAssets[id] = asset;
      }

    }

    return aAssets;
  }

  Slide.prototype.cacheAssets = function(assets){

    for (var key in assets) {
       var obj = assets[key];
        var id = obj.id.replace('mainpage_slides_','');
        PIXI.TextureCache[id]= new PIXI.Texture(new PIXI.BaseTexture(obj.result));
      }

  }

  Slide.prototype.resize = function(viewport){

    console.log('viewport.width', viewport.width);

    //this.bounds = new PIXI.Rectangle(0, 0, viewport.width, viewport.height);

    //this.width  = viewport.width;
    //this.height = viewport.height;

    // Mask
   // this.coverContainer.mask.width = viewport.width / 2;
    //this.coverContainer.mask.height = viewport.height / 2;

    //this.coverContainer.mask.tint = 0xFF0000;
    

    //this.coverContainer.width = viewport.width;
    //this.coverContainer.height = viewport.height;

    //this.maskCover.position.y = 0;// -viewport.height;
    this.maskCover.clear();
    //this.maskCover.filling = true;
    //this.maskCover.fillColor = 0xFF0000;
    //this.maskCover.lineWidth = 10;
    //this.maskCover.bounds = new PIXI.Rectangle(0, 0, viewport.width / 2, viewport.height / 2);
    this.maskCover.beginFill(0xFF0000);
    this.maskCover.drawRect(0, 0, viewport.width, viewport.height);
    this.maskCover.endFill();

  	var dimensions = Tools.fitImage(SLIDER_CONST.WIDTH, SLIDER_CONST.HEIGHT, viewport.width, viewport.height);

  	//this.coverSprite.scale.x = dimensions.ratio;
  	//this.coverSprite.scale.y = dimensions.ratio;

    //this.coverSprite.width = viewport.width;
    //this.coverSprite.height = viewport.height;

    this.coverSprite.width = dimensions.w;
    this.coverSprite.height = dimensions.h;

    //this.coverSprite.width  = dimensions.w;
    //this.coverSprite.height = dimensions.h;

  	this.coverSprite.position.x = dimensions.left;
  	this.coverSprite.position.y = dimensions.top;

  	//this.coverSpriteBlur.scale.x = dimensions.ratio;
  	//this.coverSpriteBlur.scale.y = dimensions.ratio;

    //this.coverSpriteBlur.width = viewport.width;
    //this.coverSpriteBlur.height = viewport.height;

    this.coverSpriteBlur.width = dimensions.w;
    this.coverSpriteBlur.height = dimensions.h;

    //this.coverSpriteBlur.width = dimensions.w;
    //this.coverSpriteBlur.height = dimensions.h;

  	this.coverSpriteBlur.position.x = dimensions.left;
  	this.coverSpriteBlur.position.y = dimensions.top;

    //this.mask.width = viewport.width;
    //this.mask.height = viewport.height;

    //this.coverContainer.mask = this.mask;

    //this.coverSprite.mask = this.coverSpriteBlur.mask = this.mask;
    
    //this.coverContainer.width = this.mask.width;
    //this.coverContainer.height = this.mask.height;

    //console.log('this.coverContainer', this.coverContainer, 'this.width ', this.width, 'this.coverSprite', this.coverSprite,  'this.maskCover', this.maskCover.width, 'dimensions.w', dimensions.w );
    //console.log('this', this);
    //console.log('this', this)

    this.circleContainer.position.x = (viewport.width - PIXI.TextureCache['circle'].width) * .5;
    this.circleContainer.position.y = viewport.height - 247 - (PIXI.TextureCache['circle'].height / 2 );

    //console.log('this.height', this.height);


  };

  return Slide;

})();

module.exports = S;