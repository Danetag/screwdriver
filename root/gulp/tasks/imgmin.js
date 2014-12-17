var gulp      = require('gulp'),
    imagemin  = require('gulp-imagemin');

gulp.task('imgmin', function(cb, err) {
  gulp.src('dist/img/**/*.*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'));

  cb(err);
});