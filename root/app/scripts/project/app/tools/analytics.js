'use strict';

var Config     = require('config/config');

/**
 * Init analytics by loading the Google scripts.
 * @constructor
 */
var Analytics = function(){

  this.loaded = false;

  if( window.ga ){
    // if this is required elsewhere.. don't load the script more than once.
    // console.log(' google analytics already initialized.');

    // already created the GA just return this for tracking event use.
    return this;
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  
  // Create here
  
  if (Config.gaID != null)
    ga('create', Config.gaID, 'auto');

  // this gets called on first page creation.
  //ga('send', 'pageview');

};

// the google method to retrieving a pageview. but won't work with ajax updates.
// so we force it in pagemanager and read this method.
Analytics.prototype.getCurrentUrl = function() {
  var location = window.location.protocol +
    '//' + window.location.hostname +
    window.location.pathname +
    window.location.search;
  return location;
}

Analytics.prototype.page = function(objPage) {

  if (window.ga == undefined) return;

  // console.log("\n-------- ga track page------");
  // console.log(" page page. ");
  // console.log("--------------\n");

  if( typeof objPage !== 'undefined' ){
    var page = objPage.page || "";
    var title = objPage.title || "";

    ga('send', 'pageview', {
      page: page,
      title: title
    });
  }else{
    // do not pass an empty object if undefined.
    ga('send', 'pageview');
  }

}

Analytics.prototype.eventLogo = function() {
  // console.log("\n-------- ga track------");
  // console.log(" logo clicked ");
  // console.log("--------------\n");
  
  /*
  event
    action: logo
  */

  this.event({action: 'logo', category:'', label:'', value:''});
}

Analytics.prototype.eventMenu = function(_category, _label) {
  /*
   * this tracks
   * if a user just clicks on the menu (clicks on menu icon.)
   * if a user clicks on a sub menu (is in menu clicks on themes.)
   * if a user clicks on value in a submenu (is in menu/themes/clicks betrayal.)

   * category : season / themes / characters
   * value : 1 / betrayal / don
   */


  /*
  event
    action: menu
  
  event
    action: menu

  event
    action: menu
    category: season
    label: betrayal
  */

  _label = typeof _label !== 'undefined' ? _label : '';
  
  // console.log("\n-------- ga track------");
  // console.log(_category + ' ' + _label);
  // console.log("--------------\n");

  this.event({action: 'menu', category:_category, label:_label});
}

Analytics.prototype.eventRedDot = function(_category, _landing) {
  /*
   * This tracks:
   * if a user clicks on the red dot.
   * if a user stops using the red dot.
   */
   _landing = typeof _landing !== 'undefined' ? _landing : '';

   /*
    event
      action: reddot
      category: mouseDown

    event
      action: reddot
      category: mouseUp
      label: /story/season04/how-roger-met-don
    
    event
      action: reddot
      category: touchstart

    event
      action: reddot
      category: touchend
      label: /story/season04/how-roger-met-don
    

   */


  this.event({action: 'reddot', category:_category, label: _landing}); 
}


Analytics.prototype.eventShare = function(shareService, shareUrl) {
  /*
   * This tracks:
   * User clicks on a share button which one
   * what is the value.
   */
   /*
    event
      action: share
      category: twitter [dynamic share service: google, twitter, facebook, tumblr]
      label: [full url shared by user]

   */
  
  // console.log("\n-------- ga track------");
  // console.log(' share event: ' + shareService + ' _label: ' + shareUrl);
  // console.log("--------------\n\n\n");


   this.event({action: 'share', category: shareService, label: shareUrl });
}

Analytics.prototype.event = function(event) {

  if (window.ga == undefined) return;

  if (event.category == undefined) {
    console.log('GA:: You have to provide a category', event);
    return;
  }

  if (event.action == undefined) {
    console.log('GA:: You have to provide an action', event);
    return;
  }

  var category = event.category;
  var action = event.action;
  var label = event.label || "";
  // value can only be numerical
  var value = event.value || 0;

  ga('send', 'event', category, action, label, value);
}


module.exports = Analytics;