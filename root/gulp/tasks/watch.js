var gulp        = require('gulp'),
    livereload  = require('gulp-livereload');

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./app/js/project/**/*.js', ['browserify']);
  gulp.watch('./app/css/scss/*.scss', ['compass']);
});
