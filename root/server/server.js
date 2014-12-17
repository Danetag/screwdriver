// server.js
var fs      = require('fs');
var modules = fs.readdirSync('./server/modules/');

var express = require('express');
var app     = express();
var port    = process.env.PORT || 8080;


// set up a global object
global.APP = {};
global.APP.dirServer = __dirname;
global.APP.basePath = global.APP.dirServer.replace('/server', '');

// Each module has his own logic
// ==============================================
modules.forEach(function(module) {
  var mod = require('./modules/' + module + '/app');
  mod.init(app);
});

// START THE SERVER
// ==============================================
app.listen(port);
console.log('-- Server\'s running on ' + port);

module.exports = app;
