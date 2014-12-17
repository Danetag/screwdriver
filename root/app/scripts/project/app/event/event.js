'use strict';

var Event = {
  'INIT': 'init',
  'SHOWN': 'shown',
  'HIDDEN': 'hidden',
  'RESIZE': 'resize',
  'COMPLETE': 'complete',
  'LOADER_SHOWN':'loader_shown',
  'LOADER_HIDDEN':'loader_hidden',
  'LOADER_COMPLETE':'loader_complete',
  'EXPLORE':'explore',
  
  // Menu
  'TOGGLE_MENU': 'toggle_menu',

  //Title
  'TOGGLE_TITLE' : 'toggle_title',

  // PIXI
  'CHANGE_TITLE': 'change_title',
  'GO_TO_CONTENT': 'go_to_content',
  'DISPLAY_INTERACTION' : 'display_interaction',

  // INTERACTION 
  'CLICK_POINT' : 'click_point',
  'LINE_CONNECTED' : 'line_connected',
  'INTERACTION_DONE' : 'interaction_done',
  'INTERACTION_STARTED': 'interaction_started'
}

module.exports = Event;