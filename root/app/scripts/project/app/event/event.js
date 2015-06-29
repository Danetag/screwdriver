'use strict';

var Event = {
  'INIT': 'init',
  'SHOWN': 'shown',
  'HIDDEN': 'hidden',
  'PRE_HIDDEN': 'prehidden',
  'POST_HIDDEN': 'posthidden',
  'COMPLETE': 'complete',
  'DISPOSE': 'dispose',

  // Loader
  'LOADER_SHOWN':'loader_shown',
  'LOADER_HIDDEN':'loader_hidden',
  'LOADER_COMPLETE':'loader_complete',
  'LOADER_INIT':'loader_init',
  
  // DOM
  'ON_ORIENTATION_CHANGE': 'on_orientation_change',
  'ON_RESIZE': 'on_resize',
  'ON_MOUSE_OUT': 'on_mouse_out',
  'ON_MOUSE_MOVE': 'on_mouse_move',
  'ON_MOUSE_DOWN': 'on_mouse_down',
  'ON_MOUSE_LEAVE': 'on_mouse_leave',
  'ON_MOUSE_ENTER': 'on_mouse_enter',
  'ON_MOUSE_UP': 'on_mouse_up',
  'ON_RAF': 'on_raf',
  'ON_FONT_SIZE': 'on_font_size',
  'ON_SCROLL': 'on_scroll',
  'ON_CLICK': 'on_click',
  
  // Player
  'READY': 'on_ready',
  'STATE_CHANGE': 'state_change',
  'STATE_QUALITY': 'state_quantity',
  'ON_TOGGLE_PLAY': 'on_toggle_play',
  'ON_FULLSCREEN': 'on_fullscreen',
  'ON_SEEK': 'on_seek',
  'ON_PAUSE': 'on_pause',
  'ON_STOP': 'on_stop',
  'ON_PLAY': 'on_play',
  'ON_END': 'on_end',
  'CLOSE': 'close'
}

module.exports = Event;