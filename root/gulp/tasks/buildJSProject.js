var gulp      = require('gulp'),
    concat    = require('gulp-concat');

gulp.task('buildJSProject', ['browserify'], function(cb, err) {
  
  gulp.src(['app/js/lib.js', 'app/js/project.js'])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('app/js'));

  cb(err);
  
});