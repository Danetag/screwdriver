var gulp    	= require('gulp'),
		config 		= require('../util/utils').getConfig(),
    clean     = require('gulp-rimraf');

gulp.task('cleanJS', function(cb, err) {

  return gulp.src(config.cleanJS.src)
  					 .pipe(clean());

});