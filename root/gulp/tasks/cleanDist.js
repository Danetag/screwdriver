var gulp    = require('gulp'),
    clean   = require('gulp-rimraf');

//last one depends of work task
gulp.task('cleanPHPFiles', ['work'], function(cb, err) {

  gulp.src(['./dist/**.php'])
  .pipe(clean());

  cb(err);

});

gulp.task('cleanImg', function(cb, err) {

  gulp.src(['./dist/img/**/*.*'])
  .pipe(clean());

  cb(err);

});

gulp.task('cleanDist', ['cleanPHPFiles', 'cleanImg'], function(cb, err) {

  cb(err);

});