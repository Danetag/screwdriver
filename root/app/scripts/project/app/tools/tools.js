var $                 = require('jquery')

var Tools = new function (){

	var _cache = {};
	var _test_cache = {};

	this.clearResizeCache = function() {
		_cache = {};
	}

	this.getMediaLink = function(link) {

		if ((RiteTest.FORCE_CDN || !Config.DEV) && link.indexOf('.wav') < 0) return Const.CDN_BASEPATH+link;
		else return Const.LOCAL_BASEPATH+link;
	}


	this.setCookie = function(name, value, days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		else {
			expires = "";
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	this.getCookie = function(c_name) {
		if (document.cookie.length > 0) {
			var c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				var c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) {
					c_end = document.cookie.length;
				}
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return false;
	}
    
  this.create_letter_span = function(text){
    //var text = text.html();

    var characters = text.split('<br>').join('£').split('&amp;').join('±').split('');

    //var spans = [];
    //var word = $('<span class="word"/>');
    //spans.push(word);

    var content = '';
    for(var i = 0; i < characters.length; i++) {

        if(characters[i]===" " || characters[i]==="£") {

            if (characters[i]==="£") content += '<span class="return"/>'; //spans.push($('<span class="return"/>'));
            else content += '<span class="space">' + characters[i] + '</span>'; //spans.push($('<span class="space">' + characters[i] + '</span>'));
            //word = $('<span class="word"/>');
            //spans.push(word);


        } else {

            var ch = characters[i];
            if (ch == "±") ch = "&amp;";

            content += '<span class="letter">' + ch + '</span>';
            //word.append('<span class="letter">' + ch + '</span>')

        }

    }

    return content;
  };
  
	this.getPageDimension = function () {

		var page = $(window);

		return dimension = {
			w : page.width(),
			h : page.height()
		}
	}

  this.popupwindow = function(url, title, w, h) {
      var left = (screen.width/2)-(w/2);
      var top = (screen.height/2)-(h/2);
      return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
  } 

  this.isMini=function(){
    return (App.router.current_page() == "Home" || App.router.current_page() == "User");
  }

	this.is = {
		ff: Boolean(!(window.mozInnerScreenX == null) && /firefox/.test( navigator.userAgent.toLowerCase() )),
		ie: Boolean(document.all && !window.opera),
		opera: Boolean(window.opera),
		chrome: Boolean(window.chrome),
		safari: Boolean(!window.chrome && /safari/.test( navigator.userAgent.toLowerCase() ) && window.getComputedStyle && !window.globalStorage && !window.opera)
	};

  this.testEmail=function(email) {
     var regexp = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
     return regexp.test(email);
  }

	this.getScale = function(method, container_w, container_h, content_w, content_h,safe_zone) {

		// var dimension = this.getPageDimension();

		var scale_x = this.round(container_w/content_w, 4);
		var scale_y = this.round(container_h/content_h, 4);

		if (safe_zone) {
			var scale_x_safe = this.round(container_w/(content_w*safe_zone), 4);
			var scale_y_safe = this.round(container_h/(content_h*safe_zone), 4);
		}

	      switch (method) {

	        case "contain":
	        return Math.min(scale_x,scale_y);
	        break;

	        case "width":
	        return scale_x;
	        break;

          case "height":
          return scale_y;
          break;

	        case "cover":
	        default:
			if (safe_zone) return Math.max(Math.min(scale_x, scale_y_safe) ,Math.min(scale_y,scale_x_safe));
	        else return Math.max(scale_x,scale_y);
	        break;

	      }
	}

	this.round = function(number, precision) {
		return Math.round(number * Math.pow(10,precision))/ Math.pow(10,precision);
	}

  this.fitImage = function(imageWidth,imageHeight,containerWidth,containerHeight){

    var wi = imageWidth;
    var hi = imageHeight;
    var ri = wi/hi;
    var ws = containerWidth;
    var hs = containerHeight;
    var rs = ws/hs;
    var new_dimensions={};

    ri > rs  ? (new_dimensions.ratio = hs/hi, new_dimensions.w = wi * hs/hi, new_dimensions.h = hs) : ( new_dimensions.ratio = ws/wi, new_dimensions.w = ws, new_dimensions.h = hi * ws/wi);

    new_dimensions.top = (hs - new_dimensions.h)/2;
    new_dimensions.left = (ws - new_dimensions.w)/2;
    
    return new_dimensions;

  }
  
  this.isTablet = function () {
     return Modernizr.touch && ! Tools.isMobile();
  }

  this.isIphone = function () {
    return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i);
  }
  this.isAndroid = function () {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
  }
  this.isIOS7 = function () {
    return navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i);
  }
  this.isRetina = function () {
    return !!window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1)").matches
  }
  this.isPortrait = function () {
    return !!window.matchMedia('only screen and (orientation :portrait)').matches && Modernizr.touch
  }
  this.isLandscape = function () {
    return !!window.matchMedia('only screen and (orientation :landscape)').matches
  }
  this.isIE = function () {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
  }
  this.isIE8 = function () {
    return $("html").hasClass("lt-ie9");
  }
  this.isFirefox = function () {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  }
  this.isSafari = function () {
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf("safari/") !== -1) && !window.chrome;
  }
  this.isWindowsSafari = function () {
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf("safari/") !== -1 && ua.indexOf("windows") !== -1) ;
  }

  this.isFullscreen = function (){
    return !!(document.fullScreen||document.mozFullScreen||document.webkitIsFullScreen);
  }

  this.isFullscreenAvailable = function (){
    var a=$("body")[0];
    return !!(a.requestFullScreen||a.webkitRequestFullScreen||a.mozRequestFullScreen);
  }


  this.cancelFullscreen= function(element){

    // if(!this.isFullscreenAvailable()) return;

    if(document.cancelFullScreen){document.cancelFullScreen();}
    else if(document.webkitCancelFullScreen) {document.webkitCancelFullScreen();}
    else if(document.mozCancelFullScreen) {document.mozCancelFullScreen();}
  }

  this.setFullscreen = function (element){

    // if(!this.isFullscreenAvailable()) return;

    var a = element || $("body")[0];

    if(a.requestFullScreen){a.requestFullScreen();}
    else if(a.webkitRequestFullScreen){a.webkitRequestFullScreen();}
    else if(a.mozRequestFullScreen){a.mozRequestFullScreen();}
  }

  this.isMobile = function () {
      var mobileDetect = (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) return true
      })(navigator.userAgent || navigator.vendor || window.opera);
    return mobileDetect ? true : false;
    }

  this.checkTablet = function() { 
     var mobile = (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|android|playbook|silk|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))return true;})(navigator.userAgent||navigator.vendor||window.opera,'http://detectmobilebrowser.com/mobile');
      return mobile ? true : false;
    }
/**
   * Retrieve the coordinates of the given event relative to the center
   * of the widget.
   *
   * @param event
   *   A mouse-related DOM event.
   * @param reference
   *   A DOM element whose position we want to transform the mouse coordinates to.
   * @return
   *    A hash containing keys 'x' and 'y'.
   */
  this.globalToLocal = function(event, reference) {
    var x, y;
    event = event || window.event;
    var el = event.target || event.srcElement;

    if (!window.opera && typeof event.offsetX != 'undefined') {
      // Use offset coordinates and find common offsetParent
      var pos = { x: event.offsetX, y: event.offsetY };

      // Send the coordinates upwards through the offsetParent chain.
      var e = el;
      while (e) {
        e.mouseX = pos.x;
        e.mouseY = pos.y;
        pos.x += e.offsetLeft;
        pos.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Look for the coordinates starting from the reference element.
      var e = reference;
      var offset = { x: 0, y: 0 }
      while (e) {
        if (typeof e.mouseX != 'undefined') {
          x = e.mouseX - offset.x;
          y = e.mouseY - offset.y;
          break;
        }
        offset.x += e.offsetLeft;
        offset.y += e.offsetTop;
        e = e.offsetParent;
      }

      // Reset stored coordinates
      e = el;
      while (e) {
        e.mouseX = undefined;
        e.mouseY = undefined;
        e = e.offsetParent;
      }
    }
    else {
      // Use absolute coordinates
      var pos = getAbsolutePosition(reference);
      x = event.pageX  - pos.x;
      y = event.pageY - pos.y;
    }
    // Subtract distance to middle
    return { x: x, y: y };
  }
};

var docCookies = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };


if(!window.console) console = {log: function() {}};

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

module.exports = Tools;