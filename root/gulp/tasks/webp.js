var gulp      = require('gulp'),
    webp      = require('gulp-webp'),
		config    = require('../util/utils').getConfig();


gulp.task('webp', function(cb, err){

	return gulp.src(config.webp.src)
		.pipe(webp({quality:80}))
		.pipe(gulp.dest(config.webp.dest));

});