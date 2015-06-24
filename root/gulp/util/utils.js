var Config    = require('../config.json'),
    config    = Config.desktop,
		gutil  		= require('gulp-util');

var utils = function(){};

utils.prototype = {

	watching: function(isIt) {
		
		if( isIt ){
			gutil.env.watching = true;
		}

		return gutil.env.watching || false;
	},

	getConfig: function(){
		// if gutil.env mobile tag = '-m' flag is defined.
		if( gutil.env.m ){
			config = Config.mobile;
		}
		return config;
	}
}

module.exports = new utils();