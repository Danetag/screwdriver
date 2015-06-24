var gulp      = require('gulp'),
		config 		= require('../util/utils').getConfig(),
    concat    = require('gulp-concat');

gulp.task('buildJSProject', ['browserify'], function(cb, err) {

  return gulp.src(config.buildJSProject.src)
  	.pipe(concat(config.buildJSProject.concat))
  	.pipe(gulp.dest(config.buildJSProject.dest));
  
});