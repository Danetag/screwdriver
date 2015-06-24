var gulp    	= require('gulp'),
		config 		= require('../util/utils').getConfig(),
    clean   	= require('gulp-rimraf');

gulp.task('cleanDist', function(cb, err) {

	return gulp.src(config.cleanDist.src)
  					 .pipe(clean());


});