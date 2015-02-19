// server.js

// set up a global object
global.APP = {};
global.APP.dirServer = __dirname;
global.APP.basePath = global.APP.dirServer.replace('/server', '');

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.GETCONFIG_ROOT = global.APP.dirServer + '/config'; //getconfig

var fs      	= require('fs'),
	config    	= require('getconfig'),
	onlyScripts = require('./util/scriptFilter'),
	express 	= require('express');

var modules = fs.readdirSync('./server/modules/').filter(onlyScripts.folder); //Filter out DS_STORE
var app     = express();

config.server.port  = config.server.port || 8080;

console.log('modules', modules);

// Each module has his own logic
// ==============================================
modules.forEach(function(module) {
  var mod = require('./modules/' + module + '/app');
  mod.init(app);
});

// START THE SERVER
// ==============================================
app.listen(config.server.port);
console.log('-- Server\'s running on ' + config.server.port);

module.exports = app;
