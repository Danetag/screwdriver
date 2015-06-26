'use strict';

var EVENT         = require('event/event');



/**
 * DisplayObject: Defines a view with basic methods
 * @extend {PIXI.Container}
 * @constructor
 */
var DisplayObject = function (options_){

  PIXI.Container.call(this);

  this.options = options_;

  this.viewport = {};

  this.isInit = false;

  _.extend(this, Backbone.Events);

};

DisplayObject.prototype = Object.create( PIXI.Container.prototype );
DisplayObject.prototype.constructor = DisplayObject;

DisplayObject.prototype.init = function() {
  this.render();
  this.bindEvents();
}


DisplayObject.prototype.bindEvents = function() {

}

DisplayObject.prototype.unbindEvents = function() {

}


DisplayObject.prototype.render = function() {

}

DisplayObject.prototype.update = function() {
  this.onUpdate();
}

DisplayObject.prototype.onInit = function() {

  if (this.isInit) return;

  this.isInit = true;
  this.trigger(EVENT.INIT)
}

DisplayObject.prototype.resize = function(viewport_) {
  this.viewport = (viewport_ != undefined) ? viewport_ : { width: $(window).width(), height:$(window).height() };
  this.onResize();
}

DisplayObject.prototype.onUpdate = function() {

}

DisplayObject.prototype.onResize = function() {

}

DisplayObject.prototype.dispose = function() {
  this.unbindEvents();
  
}

// TO IMPROVE
DisplayObject.prototype.generateCanvasFromSVG = function(svgString) {

  Two.Resolution = 24;

  var _twoCanvas = new Two({
    width: this.options.sceneSize.width,
    height: this.options.sceneSize.height,
    type: Two.Types.canvas
  });

  var svg = $(svgString);

  //$('body').append(svg);
  //_twoCanvas.clear();

  var shape = _twoCanvas.interpret(svg[0]);

  _twoCanvas.update();

  var scaleCoeff = 2; // ?? :/

  var imgData = _twoCanvas.renderer.domElement.getContext('2d').getImageData(this.options.building.x * scaleCoeff, this.options.building.y * scaleCoeff, this.options.building.width * scaleCoeff, this.options.building.height * scaleCoeff);
  //console.log('imgData', imgData);
  
  //_twoCanvas = null;

  var canvas = document.createElement('canvas');
  canvas.width = this.options.building.width;
  canvas.height = this.options.building.height;
  canvas.getContext('2d').putImageData(imgData, 0, 0);

  
  var image = new Image();
  image.src = _twoCanvas.renderer.domElement.toDataURL("image/png");

  //$('body').append(image);

  return canvas;
}


DisplayObject.prototype.generateGraphic = function(path_) {

  var graphic = new PIXI.Graphics();
  graphic.beginFill(0x00FF00); 


  var aPathObject = this.getAPathObject.call(this, path_);

  console.log('aPathObject', aPathObject);

  for (var i in aPathObject) {
    var path = aPathObject[i];

    //console.log('path.instruction', path.instruction);
    switch(path.instruction) {
      case "m" : console.log('graphic moveTo', path.x, path.y); graphic.moveTo(path.x, path.y); graphic.lineStyle(1, 0x00FF00); graphic.beginFill(0x00FF00); break;
      case "l" : console.log('graphic lineTo', path.x, path.y); graphic.lineTo(path.x, path.y); break;
      case "h" : console.log('graphic lineTo', path.x, 0); graphic.lineTo(path.x, 0);  break;
      case "v" : console.log('graphic lineTo', 0, path.y); graphic.lineTo(0, path.y);  break;
      case "z" : console.log('graphic endFill'); graphic.beginFill(0x00FF00); break;
    }
  }

  graphic.endFill(); 
 
  console.log('----');

  return graphic;
  //console.log('aPathObject', aPathObject);

}


/*
M = moveto
L = lineto
H = horizontal lineto
V = vertical lineto
C = curveto
S = smooth curveto
Q = quadratic Bézier curve
T = smooth quadratic Bézier curveto
A = elliptical Arc
Z = closepath
*/
DisplayObject.prototype.getAPathObject = function(path_) {

  var a = [];
  var currentNb = "";
  var currentObj = {};

  var fakeDash = false;

  for (var i = 0; i < path_.length; i++) {

    var car = path_[i];
    //console.log('car', car);

    if (car == "-") {

      //empty, in case a dash on the y params is used as a comma as well
      if (currentNb.length) {
        fakeDash = true;
        car = ","; //fake it :D
      }

    } 

    if (car == "0" 
      || car == "1" 
      || car == "2" 
      || car == "3" 
      || car == "4" 
      || car == "5" 
      || car == "6" 
      || car == "7" 
      || car == "8" 
      || car == "9"
      || car == "."
      || car == "-")
      currentNb += ""+car; //force It to String. ParseInt later
    else {

      car = car.toLowerCase();

      // new instruction
      if (car !== ",") {

          if (currentObj.instruction == undefined){ //new object, first time
            currentObj.instruction = car;
          } else {

            switch(currentObj.instruction) {
              
              case "h" : currentObj.x = parseFloat(currentNb); break;


              case "m" : currentObj.y = parseFloat(currentNb); break;
              case "z" : break;
              default  : currentObj.y = parseFloat(currentNb); break;

            }

            a.push(currentObj);

            currentNb = "";
            currentObj = {};

            // then, create a new one
            currentObj.instruction = car;
        

          }

      } else {
        currentObj.x = parseFloat(currentNb);
        currentNb = "";

        if (fakeDash) {
          currentNb += "-";
          fakeDash = false;
        }

      }

    }
    
  }

  // close the path
  a.push({
    instruction: "z"
  })

  return a;
}



module.exports = DisplayObject;