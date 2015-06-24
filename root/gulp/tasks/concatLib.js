var gulp      = require('gulp'),
		plumber 	= require('gulp-plumber'),
		config 		= require('../util/utils').getConfig(),
    concatJS  = require('gulp-concat');

gulp.task('concatLib', function(cb, err) {

	// Might want to concat them IN A SPECIFIC ORDER
  return gulp.src(config.concatLib.src)
	  .pipe(plumber())
	  .pipe(concatJS(config.concatLib.filename))
	  .pipe(gulp.dest(config.concatLib.dest));

});