var gulp 					= require('gulp'),
		runSequence 	= require('run-sequence');

gulp.task('build', function(cb){

	runSequence('cleanDist','work','copy',
							['imgmin','minify','uglify'],
              cb);

});