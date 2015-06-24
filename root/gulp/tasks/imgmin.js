var gulp      = require('gulp'),
		config 		= require('../util/utils').getConfig(),
    imagemin  = require('gulp-imagemin');

gulp.task('imgmin', function(cb, err) {
	
  return gulp.src(config.imgmin.src)
	  .pipe(imagemin())
	  .pipe(gulp.dest(config.imgmin.dest));

});