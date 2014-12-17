var $                         = require('jquery'),
    Slide                     = require('page/main/views/slider/slide'),
    _                         = require('underscore'),
    AbstractView              = require('abstract/view'),
    EVENT                     = require('event/event'),
    SLIDER_CONST              = require('page/main/views/slider/const'),
    NavigationInteraction     = require('page/interactions/navigation/navigationInteraction'),
    CommunicationInteraction  = require('page/interactions/communication/communicationInteraction'),
    ShelterInteraction        = require('page/interactions/shelter/shelterInteraction'),
    PetInteraction            = require('page/interactions/pet/petInteraction'),
    ToolsInteraction          = require('page/interactions/tools/toolsInteraction'),
    MedicalInteraction        = require('page/interactions/medical/medicalInteraction'),
    HydrationInteraction      = require('page/interactions/hydration/hydrationInteraction'),
    IlluminationInteraction   = require('page/interactions/illumination/illuminationInteraction'),
    FoodInteraction           = require('page/interactions/food/foodInteraction'),
    StartInteraction          = require('page/interactions/start/startInteraction'),
    Backbone                  = require('backbone'),
    Tools                     = require('tools/tools');

var PixiView = AbstractView.extend(new function (){

  this.initialize = function(options) {

    this.slides = options.slides;
    this.assets = options.assets;
    this.interactionsConf = options.interactions;
    this.slideIndex = 0;
    console.log('this.assets', this.assets);

    this.mouseX = 0;
    this.offsetX = 0;
    this.destinationX = 0;
    this.speed = 5;
    this.speedX = 0;
    this.mouseSpeedX = 0;
    this.speedMinToTranslate = 0.1;
    this.prevMouseX = 0;
    this.bounds = {};
    this.clickCoords = {};
    this.deltaClick = 5;
    this.snapping = false;
    this.isdown = false;
    this.destinationSnap=0;
    this.maxSpeed = 700;
    this.menuToggled = false;
    this.currentIndex = 0;
    this.isSnapping = false;
    this.menuSnapping = true;
    this.menuSnapTween;

    this.currentSlideId;

    this.interactions = {
      'Start' : StartInteraction,
      'Navigation' : NavigationInteraction,
      'Communication' : CommunicationInteraction,
      'Shelter' : ShelterInteraction,
      'Pet' : PetInteraction,
      'Tools' : ToolsInteraction,
      'Medical' : MedicalInteraction,
      'Hydration' : HydrationInteraction,
      'Illumination' : IlluminationInteraction,
      'Food' : FoodInteraction
    }

    this.currentInteraction = null;

    this.menuConf = {
      'open': {
        scale: .25,
        x: 0,
        y: 0
      },
      'close': {
        scale: 1,
        x: 0,
        y: 0
      }
    }

    this.isFirstTime = true;  

    this.slides = _.sortBy(this.slides, 'index');

    this.getSlidesFromSprite();

    /* PIXI Objects */
    this.slideshowContainer = null;
    this.stage = null;

    var rendererOptions = {
      antialias:true,
      transparent:false,
      resolution:1
    }
 
    // create a renderer instance.
    this.renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height(),rendererOptions);
    this.renderer.view.id = "main-canvas";

    //console.log('this.renderer', this.renderer.gl);
    //this.renderer.gl.lineJoin = 'round';
  }

  this.getSlidesFromSprite = function () {

    //normal
    _extractCanvasFromImg.call(this, this.assets.sprite_normal_01.result, 'coverAsset');
    _extractCanvasFromImg.call(this, this.assets.sprite_normal_02.result, 'coverAsset');

    //restart index global
    this.slideIndex = 0;
    //blur
    _extractCanvasFromImg.call(this, this.assets.sprite_blur.result, 'coverBlurAsset');
  }

  this.getOldSlide = function () {
    var matchFound = false;
    for (var i = 0, len = this.slideshowContainer.children.length; i < len; i++)
      {
          matchFound = this.slideshowContainer.children[i].id == this.currentSlideId;
          if(matchFound){
              return this.slideshowContainer.children[i];
              break;
          }
      }  
  }

  var _extractCanvasFromImg = function(img, coverName) {

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    var tilesX = img.width / SLIDER_CONST.WIDTH;
    var tilesY = img.height / SLIDER_CONST.HEIGHT;

    var canvasPaste = canvas.cloneNode(false);
    canvasPaste.width = SLIDER_CONST.WIDTH;
    canvasPaste.height = SLIDER_CONST.HEIGHT;

    var i, j, canvasPasteTemp, imgData;
    var list = [];
    var currentIndex = index = 0;
    var startIndex = index * SLIDER_CONST.NB_SLIDE;
    for (i = 0; i < tilesY; i++) {
      for (j = 0; j < tilesX; j++) {
        var slide = this.slides[this.slideIndex];
        // Store the image data of each tile in the array.
        canvasPasteTemp = canvasPaste.cloneNode(false);
        imgData = ctx.getImageData(j * SLIDER_CONST.WIDTH, i * SLIDER_CONST.HEIGHT, SLIDER_CONST.WIDTH, SLIDER_CONST.HEIGHT);
        canvasPasteTemp.getContext('2d').putImageData(imgData, 0, 0);

        //list[ startIndex + currentIndex ] = canvasPasteTemp;
        slide[coverName] = canvasPasteTemp;
        currentIndex++;
        this.slideIndex++;
      }
      //this.slideIndex++;
    }

  }

  this.bindEvents = function(){

    // Mouse/touch events
    this.slideshowContainer.mousedown = this.slideshowContainer.touchstart = $.proxy(this.mouseDownHandler, this);
    this.slideshowContainer.mousemove = this.slideshowContainer.touchmove = $.proxy(this.mouseMoveHandler, this);
    this.stage.mouseup = this.slideshowContainer.touchend = $.proxy(this.mouseUpHandler, this);

  }

  this.setInteractive = function(interactive){

    // Mouse/touch events
    this.slideshowContainer.interactive = interactive;
    this.stage.interactive = interactive;
  }

  this.toggleMenu = function(){

    this.menuToggled = !this.menuToggled;

    var currentSlide = this.slideshowContainer.children[this.currentIndex];
    currentSlide.toggleCircle(!this.menuToggled);

    //check if we change slide during menu toggled
    if(!this.menuToggled && this.currentSlideId!=currentSlide.id ){
      
      //we start by toogle Background of old slide
      var oldSlide = this.getOldSlide();

      //then update current ID
      this.currentSlideId = currentSlide.id;

      if(this.currentInteraction) oldSlide.toggleBackground(true);
      if(this.currentInteraction) _interactionHidden.call(this);

    }
    console.log("Current Slide ID",this.currentSlideId);

    //interaction
    if (this.currentInteraction != null) {
      this.currentInteraction.toggleInteractive();
      this.setInteractive(this.menuToggled);
    }

    var menuConf = this.menuToggled ? this.menuConf.open : this.menuConf.close;
    var menuPositionX = -(this.currentIndex * this.viewport.width*menuConf.scale) + (this.viewport.width/2 - ((this.viewport.width*menuConf.scale) / 2));
      
    this.bounds.left = this.viewport.width/2 - ((this.viewport.width *menuConf.scale)/2);

    TweenMax.to(this.slideshowContainer.scale, .3, {x: menuConf.scale, y: menuConf.scale, ease: Power2.easeOut});
    TweenMax.to(this.slideshowContainer, .3 , {y: menuConf.y, x: menuPositionX , ease: Power2.easeOut,onComplete:function(){
      //We set the limits to the middle of the screen for each side
      this.bounds.right = (-this.viewport.width * ( this.slideshowContainer.children.length - 1) * menuConf.scale) + this.viewport.width/2 - ((this.viewport.width *menuConf.scale)/2);
      }.bind(this)
    });

    if(this.menuToggled){
      var slideArray = this.slideshowContainer.children.slice(0);

      this.menuSnapping = true;

      //toggle number
      TweenMax.from(this.numberContainer, .5, {alpha:0,delay:.6,ease:Power1.easeIn});
      TweenMax.from(this.numberContainer.position, .5, {y:100,delay:.6,ease:Power1.easeIn});

      TweenMax.from(this.mainTitleContainer, .5, {alpha:0,delay:.4,ease:Power1.easeIn});
      TweenMax.from(this.mainTitleContainer.position, .5, {y:50,delay:.4,ease:Power1.easeIn});

      slideArray.splice(this.currentIndex,1);

      TweenMax.to(slideArray, .3, {alpha:0});
            
      var i = this.currentIndex;
      var j = this.currentIndex;
      var t = 0;
      while (t<=slideArray.length) {
          var slide = slideArray[i];
          var slide2 = slideArray[j-1];
          if(slide)  TweenMax.from(slide, .3, {alpha:0,y:-100,delay:.3+(0.2*t)});
          if(slide2) TweenMax.from(slide2, .3, {alpha:0,y:100,delay:.3+(0.2*t)});
          i++;
          t++;
          j--;
      }
    }
  }

  this.render = function(){

    // Hand + Circle for each Slides
    PIXI.TextureCache['hand']   = new PIXI.Texture(new PIXI.BaseTexture(this.assets.hand.result));
    PIXI.TextureCache['circle'] = new PIXI.Texture(new PIXI.BaseTexture(this.assets.circle.result));

    // create an new instance of a pixi stage
    this.stage = new PIXI.Stage(0x000000);
    
    this.slideshowContainer = new PIXI.DisplayObjectContainer();
    this.slideshowContainer.interactive = true; 
    this.slideshowContainer.buttonMode = true;

    this.numberContainer = new PIXI.DisplayObjectContainer();
    this.mainTitleContainer = new PIXI.DisplayObjectContainer();

    this.halo = new PIXI.Graphics();
    this.halo.beginFill('0xffffff');
    this.halo.drawRect(0, 0, 300, 1000);
    this.halo.endFill();
    this.halo.alpha=.03;
    this.halo.pivot.x = .5;
    this.halo.pivot.y = .5;

    this.bindEvents();

    this.renderSlide();
    this.renderSlideshow();

    this.canUpdate = true;

    //Remove assets referenes
    this.assets.length = 0;
    this.assets = null;

  }

  this.renderSlide = function(){

    for (var i in this.slides) {

      var s = this.slides[i];
      s.assets = _getAssetsFromID.call(this, s.id);

      var slide = new Slide(s); 
      slide.shownCallback  = $.proxy(_onSlideShown, this);
      slide.hiddenCallback = $.proxy(_onSlideHidden, this);
      slide.render();
        
      slide.position.x = slide.width * s.index;
      this.listenTo(slide, EVENT.DISPLAY_INTERACTION, $.proxy(_displayInteraction, this));

      this.slideshowContainer.addChild(slide);

      var titleContainer = new PIXI.DisplayObjectContainer();
      titleContainer.width = slide.width;
      titleContainer.height = slide.height;
      titleContainer.position.x = (slide.width * s.index);
      titleContainer.position.y = 0;
      var title = new PIXI.Text(s.title.toUpperCase(), { font: "500 24px Montserrat", fill: "#ffffff", align: "center"});
      titleContainer.addChild(title);

      var textContainer = new PIXI.DisplayObjectContainer();
      textContainer.width = slide.width;
      textContainer.height = slide.height;
      textContainer.position.x = (slide.width * s.index);
      textContainer.position.y = 0;

      var background = new PIXI.Graphics();
      var randomColor = (Math.random().toString(16) + '000000').slice(2, 8);
      background.beginFill('0x'+randomColor);
       
      // draw a rectangle
      background.drawRect(0, 0, slide.width, slide.height);
      background.endFill();
      background.alpha=.5;

      //render big text for the background 
      var text = new PIXI.Text("0"+i, { font: "700 800px Montserrat", fill: "#171717", align: "center"});

      textContainer.addChild(background);
      textContainer.addChild(text);

      this.mainTitleContainer.addChild(titleContainer);
      this.numberContainer.addChild(textContainer);
    }

  }

  this.renderSlideshow = function(){

    
    //this.slideshowContainer.position.y = Tools.getPageDimension().h/2;

    //var childrens = this.slideshowContainer.children;
    //var childrenLength = childrens.length;

    //this.bounds.left = 0;
    //this.bounds.right = -childrens[childrenLength-1]._width *( childrenLength-1);
    this.stage.addChild(this.numberContainer);
    this.stage.addChild(this.mainTitleContainer);
    this.stage.addChild(this.halo);
    this.stage.addChild(this.slideshowContainer);
    //requestAnimFrame(this.update.bind(this));
  }

  this.goTo = function(id, direct) {

    // Each sprite
    for (var i in this.slideshowContainer.children) {

      var displayObject = this.slideshowContainer.children[i];

      if (displayObject.type === SLIDER_CONST.TYPE && displayObject.id === id) {

        this.currentIndex = i;
        this.destinationSnap = this.viewport.width * this.currentIndex;

        if (direct) TweenLite.set(this.slideshowContainer.position, {x:-this.destinationSnap});
        else TweenLite.to(this.slideshowContainer.position, .5, {x:-this.destinationSnap, ease : Cubic.easeOut});

        break;
      }

    }

  }

  this.show = function() {
    var currentSlide = this.slideshowContainer.children[this.currentIndex];

    this.currentSlideId = currentSlide.id;
    this.trigger(EVENT.CHANGE_TITLE, {title:currentSlide.title,subtitle:currentSlide.subtitle, tutorial:currentSlide.tutorial});

    //this.listenToOnce(currentSlide, EVENT.SHOWN, _currentSlideShown.bind(this));
    currentSlide.show();
  }

  /* Mouse/Touch Events */

  this.clickMenuHandler = function(data){
    var currentCoordX = data.getLocalPosition(this.slideshowContainer).x;
    this.currentIndex = Math.floor(currentCoordX / this.viewport.width);
    this.trigger(EVENT.TOGGLE_MENU,{});
    
    if (this.slideshowContainer.position.x >= this.bounds.left) this.slideshowContainer.position.x = this.bounds.left;
    else if (this.slideshowContainer.position.x <=  this.bounds.right) this.slideshowContainer.position.x = this.bounds.right;
    this.snapping = true;

    var currentSlide = this.slideshowContainer.children[this.currentIndex];
    // Do it before the current show
    if(currentSlide)this.trigger(EVENT.CHANGE_TITLE, {title:currentSlide.title, subtitle:currentSlide.subtitle, tutorial:currentSlide.tutorial});

  }

  this.mouseDownHandler = function(data){
    if (this.isSnapping) return;

    var currentItem = data.target;
    //currentItem.alpha = .2;
    this.snapping = false;

    if(this.menuToggled) this.menuSnapping = false;
    if(this.menuSnapTween) this.menuSnapTween.kill();

    this.isdown = true;
    this.mouseX =  data.getLocalPosition(this.stage).x;

    //get coords to check if click or drag
    this.clickCoords.x = data.getLocalPosition(this.stage).x;
    this.clickCoords.y = data.getLocalPosition(this.stage).y;

    var objectX = currentItem.position.x;
    
    this.offsetX = this.mouseX - objectX;

    //console.log('this.mouseX', this.mouseX, 'objectX', objectX, 'this.offsetX', this.offsetX );

    //var currentSlide = this.slideshowContainer.children[this.currentIndex];

    //currentSlide.toggleCircle();
    //currentSlide.hide();

  }


  this.mouseMoveHandler = function(data){

    if (this.isSnapping) return;
    this.mouseX =  data.getLocalPosition(this.stage).x;
    this.mouseSpeedX = data.getLocalPosition(this.stage).x;

  }

  this.mouseUpHandler = function(data){
    console.log("UP");
    if (this.isSnapping) return;

    var endClickCoordX = data.getLocalPosition(this.stage).x;
    var endClickCoordY = data.getLocalPosition(this.stage).y;

    //CLICK ON THE MENU
    if(Math.abs(endClickCoordX-this.clickCoords.x) < this.deltaClick && Math.abs(endClickCoordY-this.clickCoords.y) < this.deltaClick && this.menuToggled ){
      this.clickMenuHandler(data);
    }

    this.time_Start = new Date();

    this.isdown = false;

  }

  /* Actions */

  this.snapSlide = function(gBackToInitialState) {

    var goBackToInitialState = (gBackToInitialState != undefined) ? gBackToInitialState : false;

    //console.log('snapSlide !', this.currentIndex, goBackToInitialState);

    this.time_Stop = new Date();
    
    var snapRatio = this.menuToggled ? .25 : 1;

    console.log('Time :: ', this.time_Stop - this.time_Start);

    this.destinationSnap = (this.viewport.width * snapRatio) * this.currentIndex;
    this.menuConf.close.x = -this.viewport.width * this.currentIndex;

    //TweenMax.to(this.slideshowContainer.position, .5, {x:-this.destinationSnap,ease : Cubic.easeOut});

    this.snapping = true;
    this.isSnapping = true;

    if (!goBackToInitialState) {

      var currentSlide = this.slideshowContainer.children[this.currentIndex];

      //check if we change slide during menu toggled
      if(this.currentSlideId!=currentSlide.id ){
        this.currentSlideId = currentSlide.id;
      }

      console.log("Current Slide ID",this.currentSlideId);

      // If current one, kill it
      _interactionHidden.call(this);

      // Do it before the current show
      this.trigger(EVENT.CHANGE_TITLE, {title:currentSlide.title, subtitle:currentSlide.subtitle,  tutorial:currentSlide.tutorial});
      
      // Each sprite
      for (var i in this.slideshowContainer.children) {

        var displayObject = this.slideshowContainer.children[i];

        if (displayObject.type === SLIDER_CONST.TYPE) {

          TweenMax.killTweensOf(displayObject.coverSpriteBlur);
          displayObject.coverSpriteBlur.alpha =  1 ;
          TweenMax.to(displayObject.coverSpriteBlur, 1.5, {alpha:0, ease: Power2.easeOut});

        }

      }

      if(this.menuToggled) TweenMax.to(this.slideshowContainer.position, .5, {x:-(this.destinationSnap+((((this.viewport.width*this.menuConf.open.scale)/2)-(this.viewport.width/2)))), ease : Cubic.easeOut, onComplete: $.proxy(_showCurrentSlide, this)});
      else TweenMax.to(this.slideshowContainer.position, .5, {x:-this.destinationSnap, ease : Cubic.easeOut, onComplete: $.proxy(_showCurrentSlide, this)});

    }
    else {
      this.isSnapping = false;

      
      TweenMax.to(this.slideshowContainer.position, .5, {x:-this.destinationSnap,ease : Cubic.easeOut});
    }
    

  }

  

  this.onUpdate = function() {

    //this.stats.begin();

    // If a current translation, don't do anything else and let the translation finish first
    // if (this.isSnapping) {
    //   this.renderer.render(this.stage);
    //   requestAnimFrame( this.update.bind(this) );
    //   return;
    // }
    if (this.currentInteraction && this.currentInteraction.canUpdate ) this.currentInteraction.onUpdate();

    if (this.isdown) {

      this.destinationX = this.mouseX;
      this.speedX = this.mouseSpeedX - this.prevMouseX;

      // Not going faster then the maxSpeed
      this.speedX = Math.round(Math.max(Math.min(this.speedX , this.maxSpeed), -this.maxSpeed));
      
      //move container based on drag
      this.slideshowContainer.position.x -= (this.slideshowContainer.position.x - (this.destinationX - this.offsetX)) / this.speed;

      this.numberContainer.position.x = (this.viewport.width*(this.slideshowContainer.children.length-1)*2) * -(this.slideshowContainer.position.x-this.bounds.left)/(this.bounds.right-this.bounds.left);

      this.mainTitleContainer.position.x = (this.viewport.width*(this.slideshowContainer.children.length-1)) * -(this.slideshowContainer.position.x-this.bounds.left)/(this.bounds.right-this.bounds.left);

      //bounds limit, right ~= -10000
      //if (this.slideshowContainer.position.x >= this.bounds.left) this.slideshowContainer.position.x = this.bounds.left;
      //else if (this.slideshowContainer.position.x <=  this.bounds.right) this.slideshowContainer.position.x = this.bounds.right;
      
    } else {
      
      //SNAPPING TWEEN PART
      //console.log('-- actual speed', this.speedX);
      if (Math.abs(this.speedX) >= this.speedMinToTranslate && !this.menuToggled) {

        if (!this.snapping) {

          //this.currentIndex = Math.abs((Math.round(this.slideshowContainer.position.x / this.slideshowContainer.children[0].width)));
          var index = this.currentIndex;

          if (this.speedX < 0) index++;
          else index--;

          if (index >= this.slideshowContainer.children.length) index = this.slideshowContainer.children.length -1;
          if (index <= 0) index = 0;

          var gBackToInitialStat = false;

          if (index === this.currentIndex) {
            gBackToInitialStat = true;
          }
          else {
            var currentSlide = this.slideshowContainer.children[this.currentIndex];
            currentSlide.hide();
          }
          
          this.currentIndex = index;

          this.snapSlide(gBackToInitialStat);
        } 

      }
      else if (this.menuToggled){
          //SNAPPING LIVE
          // if(this.speedX<0 && this.speedX>=-1){
          //   if(!this.snapping){
          //     var decalage = this.viewport.width/2 - ((this.viewport.width *this.menuConf.open.scale)/2);
          //     var newWidth = this.viewport.width*this.menuConf.open.scale
          //     this.currentIndex = Math.abs((Math.round((-decalage + this.slideshowContainer.position.x)/newWidth)));
          //     console.log(this.currentIndex);
          //     } 
          // }
          // if(this.speedX>0 && this.speedX<=1){
          //    if(!this.snapping){

          //     var decalage = this.viewport.width/2 - ((this.viewport.width *this.menuConf.open.scale)/2);
          //     var newWidth = this.viewport.width*this.menuConf.open.scale
          //     this.currentIndex = Math.abs((Math.round((-decalage + this.slideshowContainer.position.x)/newWidth)));
          //     console.log(this.currentIndex);

          //   }
          // }

        // var decalage = this.viewport.width/2 - ((this.viewport.width *this.menuConf.open.scale)/2);
        // var newWidth = this.viewport.width*this.menuConf.open.scale;
        //this.currentIndex = Math.abs((Math.round((-decalage + this.slideshowContainer.position.x)/newWidth)));

        // var currentSlide = this.slideshowContainer.children[this.currentIndex];
        // // Do it before the current show
        // if(currentSlide)this.trigger(EVENT.CHANGE_TITLE, {title:currentSlide.id});
  
        if(Math.abs(this.speedX)<1){
          this.speedX=0;
          //console.log(this.slideshowContainer.position.x+((this.viewport.width*this.menuConf.open.scale)/2)-(this.viewport.width/2));
          //console.log(this.viewport.width*this.menuConf.open.scale*this.slides.length);
          if(!this.menuSnapping){

            var snapIndex = Math.round(10*(this.slideshowContainer.position.x + ((this.viewport.width*this.menuConf.open.scale)/2)-(this.viewport.width/2))/(this.viewport.width*this.menuConf.open.scale*this.slides.length));

            var destinationSnap = snapIndex*(this.viewport.width*this.menuConf.open.scale)-((((this.viewport.width*this.menuConf.open.scale)/2)-(this.viewport.width/2)));
            
            this.menuSnapTween = TweenLite.to(this.slideshowContainer.position, 1, {x:destinationSnap, ease : Cubic.easeOut});

            this.currentIndex = -snapIndex;

            this.menuSnapping=true;
          }


        }

        //move container based on speed after realeased 
        this.slideshowContainer.position.x += this.speedX;
        this.numberContainer.position.x = (this.viewport.width*(this.slideshowContainer.children.length-1)*2) * -(this.slideshowContainer.position.x-this.bounds.left)/(this.bounds.right-this.bounds.left);
        this.mainTitleContainer.position.x = (this.viewport.width*(this.slideshowContainer.children.length-1)) * -(this.slideshowContainer.position.x-this.bounds.left)/(this.bounds.right-this.bounds.left);

        //bounds limit, right ~= -10000
        if(this.slideshowContainer.position.x>=this.bounds.left){
          this.slideshowContainer.position.x = this.bounds.left;
          this.speedX *= -0.75;
        } 
        else if (this.slideshowContainer.position.x<=this.bounds.right){
          this.slideshowContainer.position.x = this.bounds.right;
          this.speedX *= -0.75;

        } 
      
      }
      else if (!this.snapping) {

        this.snapSlide(true);
      }

    }

    this.speedX *= 0.9;

    if (Math.abs(this.speedX) <= 0.01) this.speedX = 0;

    this.prevMouseX = this.mouseSpeedX;

    // render the stage   
    this.renderer.render(this.stage);
    //requestAnimFrame(this.update.bind(this));

    //this.stats.end();
  };

  this.easeOutQuint = function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  }

  this.onMouseOut = function(outWindow) {
    this.isdown = false;

    if (this.currentInteraction != null) this.currentInteraction.onMouseOut(outWindow);
  }

  this.getCurrentSlide = function() {
    return this.slideshowContainer.children[this.currentIndex];
  }

  this.resize = function(viewport){

    this.viewport = viewport;

    this.renderer.resize(viewport.width, viewport.height);

    for (var i in this.slideshowContainer.children) {

      var displayObject = this.slideshowContainer.children[i];
      var displayNumber = this.numberContainer.children[i];
      var displayTitle = this.mainTitleContainer.children[i];

      if (displayObject.type === SLIDER_CONST.TYPE) {

        displayObject.resize(viewport);
        displayObject.position.x = viewport.width * displayObject.index;
        displayNumber.position.x = viewport.width * (displayObject.index * 2);
        displayTitle.position.x = viewport.width * (displayObject.index);
        
        var randomColor = (Math.random().toString(16) + '000000').slice(2, 8);

        var background = displayNumber.children[0];
        background.clear();
        background.beginFill('0x000000');
        background.drawRect(0, 0, viewport.width, viewport.height);
        background.endFill();
        background.alpha=.5;

        var number = displayNumber.children[1];
        number.position.x = viewport.width/2;
        number.position.y = viewport.height/2;
        number.anchor.x = .5;
        number.anchor.y = .5;

        var title = displayTitle.children[0];
        title.position.x = viewport.width/2;
        title.position.y = viewport.height/1.33;
        title.anchor.x = .5;
        title.anchor.y = .5;
      }

    }

    this.halo.clear();
    this.halo.beginFill('0xffffff');
    this.halo.drawRect(0, 0, viewport.width * this.menuConf.open.scale , viewport.height);
    this.halo.endFill();
    this.halo.position.x = viewport.width/2-((viewport.width * this.menuConf.open.scale)/2);

    // Update conf menu
    var menuConf = this.menuToggled ? this.menuConf.open : this.menuConf.close;
    this.menuConf.open.y = ( viewport.height - viewport.height * this.menuConf.open.scale ) * .5;
    this.menuConf.close.x = -this.viewport.width * this.currentIndex;

    if (this.menuToggled) {
      TweenMax.to(this.slideshowContainer, .5, {y: menuConf.y, x: menuConf.x, ease: Power2.easeOut});
    }
    
    //update bounds
    this.bounds.left  = 0;
    this.bounds.right = -this.viewport.width * ( this.slideshowContainer.children.length - 1) * menuConf.scale;

    //update Slideshow pos
    this.slideshowContainer.position.x = -viewport.width * this.currentIndex;

    // current interaction
    if (this.currentInteraction) this.currentInteraction.resize(this.viewport);
  };


  var _displayInteraction = function(datas){
    
  
    this.setInteractive(false);

    this.currentInteraction = new this.interactions[datas.interaction](this.interactionsConf[datas.interaction]);

    this.trigger(EVENT.TOGGLE_TITLE,{state:true});
    this.trigger(EVENT.INTERACTION_STARTED);

    this.numberContainer.alpha=0;
    this.mainTitleContainer.alpha=0;
    this.halo.alpha=0;
    
    this.listenToOnce(this.currentInteraction, EVENT.INTERACTION_DONE, $.proxy(_interactionDone, this));
    this.listenToOnce(this.currentInteraction, EVENT.INIT, $.proxy(_interactionInit, this));
    this.listenToOnce(this.currentInteraction, EVENT.HIDDEN, $.proxy(_interactionHidden, this));
    this.listenToOnce(this.currentInteraction, EVENT.SHOWN, $.proxy(_interactionShown, this));

    this.currentInteraction.init();
    this.currentInteraction.resize(this.viewport);

    this.stage.addChild(this.currentInteraction);

  }

  var _interactionInit = function() {
    this.currentInteraction.show();
  }

  var _interactionShown = function() {

  }

  var _interactionDone = function(){

    if(this.currentInteraction){
      //this.currentInteraction.hide();
      setTimeout($.proxy(function(){
        this.trigger(EVENT.INTERACTION_DONE);

        _.delay(function(){
          this.numberContainer.alpha=1;
          this.mainTitleContainer.alpha=1;
          this.halo.alpha=0.03;
        }.bind(this),1200);

      }, this), 700);
    }

  }

  var _interactionHidden = function() {

    if (this.currentInteraction == null) return;

    this.setInteractive(true);

    this.currentInteraction.setInteractive(false);
    this.currentInteraction.dispose();
    
    this.stage.removeChild(this.currentInteraction);

    this.currentInteraction = null;

    this.getCurrentSlide().toggleBackground(true,1);

    this.trigger(EVENT.TOGGLE_TITLE);

    
  }

  var _getAssetsFromID = function(ID) {

    var aAssets = {};

    for (var name in this.assets) {

      var asset = this.assets[name];

      // Has to be at the beginning
      if (name.indexOf(ID + "_") === 0 ) {

        var currentId = ID + "_";
        var id = name.substr(currentId.length); // we remove the first part

        aAssets[id] = asset;
      }

    }

    return aAssets;
  }

  var _showCurrentSlide = function() {

    this.isSnapping = false;

    var currentSlide = this.slideshowContainer.children[this.currentIndex];
    currentSlide.show(this.menuToggled);
  }

  var _onSlideShown = function(e) {

    console.log('_onSlideShown');

    //if (this.isFirstTime) {
     // this.isFirstTime = false;

      // Wait a little bit here
      //setTimeout($.proxy(function(){
        this.trigger(EVENT.SHOWN, {id:this.id});
      //}, this), 500);
      
    //} else {
     // this.trigger(EVENT.SLIDE_SHOWN, {id:'homepage'})
   // }

  }

  var _onSlideHidden = function(e) {

  }

});


module.exports = PixiView;