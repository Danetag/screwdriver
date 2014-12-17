var gulp    = require('gulp'),
    clean   = require('gulp-rimraf');

gulp.task('cleanJS', function() {

  // App
  gulp.src(['./app/js/*.js'])
  .pipe(clean());

});