var gulp      = require('gulp'),
	plumber = require('gulp-plumber'),
    concatJS  = require('gulp-concat');

gulp.task('concatLib', function(cb, err) {
  gulp.src('./app/scripts/vendor/*.js')
  .pipe(plumber())
  .pipe(concatJS('lib.js'))
  .pipe(gulp.dest('app/js'));
  cb(err);
});