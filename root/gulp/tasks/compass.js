var gulp = require('gulp');
var compass = require('gulp-compass');

gulp.task('compass', function() {
  gulp.src('./app/css/scss/*.scss')
  .pipe(compass({
    config_file: 'compass.rb',
    css: 'app/css',
    sass: 'app/css/scss'
  }))
  .pipe(gulp.dest('app/css'));
});