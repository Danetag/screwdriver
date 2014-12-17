var gulp   = require('gulp');

// Last one depends of 'cleanDist'
gulp.task('copyDatasJSON', ['cleanDist'], function(cb, err) {
  return gulp.src('app/datas/**.*')
    .pipe(gulp.dest('dist/datas'));

  cb(err);

});

gulp.task('copyImg', ['copyDatasJSON'],  function(cb, err) {
  return gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));

  cb(err);

});

gulp.task('copyIncludePHP', ['copyImg'],  function(cb, err) {
  return gulp.src('app/include_php/**.*')
    .pipe(gulp.dest('dist/include_php'));

  cb(err);

});

gulp.task('copyFont', ['copyIncludePHP'], function(cb, err) {
  return gulp.src('app/css/fonts/**.*')
    .pipe(gulp.dest('dist/css/fonts'));

  cb(err);

});

gulp.task('copyPHPFiles', ['copyFont'], function(cb, err) {
  return gulp.src('app/**.php')
    .pipe(gulp.dest('dist'));

  cb(err);
});

gulp.task('copy', ['copyPHPFiles'], function(cb, err) {
  cb(err);
});