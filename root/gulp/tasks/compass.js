var gulp      = require('gulp'),
  compass     = require('gulp-compass'),
  livereload  = require('gulp-livereload'),
  plumber = require('gulp-plumber');

gulp.task('compass', function() {
  gulp.src('./app/css/scss/*.scss')
  .pipe(plumber())
  .pipe(compass({
    config_file: 'compass.rb',
    css: 'app/css',
    sass: 'app/css/scss',
    sourcemap: 'true'
  }))
  .pipe(gulp.dest('app/css'))
  .pipe(livereload({ auto: false }));
});