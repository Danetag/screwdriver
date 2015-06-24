var gulp 					= require('gulp'),
		runSequence 	= require('run-sequence');

gulp.task('work', function(cb, err){

	return runSequence(['cleanJS', 'iconfonts', 'concatLib', 'buildJSProject', 'webp'], 'stylus', cb);
  
});