var path = require("path");

var Filter = function(){};

Filter.prototype = {

	// Filters out.DS_STORE
	folder: function(name){
		return !/((.DS_Store|.DS_STORE)$)/i.test(name);
	},

	// Filters out non .coffee and .js files. Prevents
	// accidental inclusion of possible hidden files (DS_STORE for instance)
	file: function(name){
		return /(\.(js|coffee)$)/i.test(path.extname(name));
	}
}

module.exports = new Filter();