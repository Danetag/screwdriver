var gulp 			= require('gulp'),
		config 		= require('../util/utils').getConfig()
		minifycss = require('gulp-minify-css');

gulp.task('minify', function(cb, err) {

	// app.css
  gulp.src(config.minify.src)
	  .pipe(minifycss())
	  .pipe(gulp.dest(config.minify.dest));

	// noscript.css
	return gulp.src(config.minify.noScript.src)
	  .pipe(minifycss())
	  .pipe(gulp.dest(config.minify.noScript.dest));

});