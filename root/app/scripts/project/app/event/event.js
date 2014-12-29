'use strict';

var Event = {
  'INIT': 'init',
  'SHOWN': 'shown',
  'HIDDEN': 'hidden',
  'COMPLETE': 'complete',

  // Loader
  'LOADER_SHOWN':'loader_shown',
  'LOADER_HIDDEN':'loader_hidden',
  'LOADER_COMPLETE':'loader_complete',
  
  // Menu
  'TOGGLE_MENU': 'toggle_menu',

  // DOM
  'ON_ORIENTATION_CHANGE': 'on_orientation_change',
  'ON_RESIZE': 'on_resize',
  'ON_MOUSE_OUT': 'on_mouse_out',
  'ON_RAF': 'on_raf'
}

module.exports = Event;