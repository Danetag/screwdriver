var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('minify', function(cb, err) {
  gulp.src('./app/css/app.css')
  //.pipe(rename({ suffix: '.min' }))
  .pipe(minifycss())
  .pipe(gulp.dest('dist/css'));

  cb(err);
});