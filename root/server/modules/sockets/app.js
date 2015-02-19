var yetify    = require('yetify'),
    config    = require('getconfig'),
    uuid      = require('node-uuid'),
    crypto    = require('crypto'),
    io        = require('socket.io');

var SocketModule = function() {

  this.app = null;

}

SocketModule.prototype = {

  init: function(app) {

    this.app = app;

    return false;

    console.log('init SocketModule');

    io.listen(config.server.port);

    if (config.logLevel) {
      // https://github.com/Automattic/socket.io/wiki/Configuring-Socket.IO
      io.set('log level', config.logLevel);
    }

    this.bindEvents();
  },
  bindEvents: function() {

    var self = this;

    io.sockets.on('connection', function (client) {
      self.onConnection(client);
    });

    if (config.uid) process.setuid(config.uid);
    console.log(yetify.logo() + ' -- signal master is running at: http://localhost:' + this.port);
  },
  onConnection: function(client){

    client.resources = {
        screen: false,
        video: false,
        audio: false
    };

    // Bind Client Events
    client.on('message', function (details) {
      if (!details) return;

      var otherClient = io.sockets.sockets[details.to];
      if (!otherClient) return;

      details.from = client.id;
      otherClient.emit('message', details);
    });

    client.on('shareScreen', function () {
      client.resources.screen = true;
    });

    client.on('unshareScreen', function (type) {
      client.resources.screen = false;
      removeFeed('screen');
    });

    // we don't want to pass "leave" directly because the
    // event type string of "socket end" gets passed too.
    client.on('disconnect', function () {
        removeFeed();
    });
    client.on('leave', function () {
        removeFeed();
    });

    client.on('create', function (name, cb) {
      if (arguments.length == 2) {
          cb = (typeof cb == 'function') ? cb : function () {};
          name = name || uuid();
      } else {
          cb = name;
          name = uuid();
      }
      // check if exists
      if (io.sockets.clients(name).length) {
          safeCb(cb)('taken');
      } else {
          join(name);
          safeCb(cb)(null, name);
      }
    });

    client.on('join', join);

    // tell client about stun and turn servers and generate nonces
    client.emit('stunservers', config.stunservers || []);

    // create shared secret nonces for TURN authentication
    // the process is described in draft-uberti-behave-turn-rest
    var credentials = [];
    config.turnservers.forEach(function (server) {
        var hmac = crypto.createHmac('sha1', server.secret);
        // default to 86400 seconds timeout unless specified
        var username = Math.floor(new Date().getTime() / 1000) + (server.expiry || 86400) + "";
        hmac.update(username);
        credentials.push({
            username: username,
            credential: hmac.digest('base64'),
            url: server.url
        });
    });
    client.emit('turnservers', credentials);

    function removeFeed(type) {
      if (client.room) {
        io.sockets.in(client.room).emit('remove', {
            id: client.id,
            type: type
        });
        if (!type) {
            client.leave(client.room);
            client.room = undefined;
        }
      }
    }

    function join(name, cb) {

        // sanity check
        if (typeof name !== 'string') return;

        // leave any existing rooms
        removeFeed();
        safeCb(cb)(null, describeRoom(name));
        client.join(name);
        client.room = name;
    }

  }

}



module.exports = new SocketModule();

