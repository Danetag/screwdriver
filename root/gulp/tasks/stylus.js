var gulp        = require('gulp'),
    stylus      = require('gulp-stylus'),
    livereload  = require('gulp-livereload'),
    nib         = require('nib'),
    plumber     = require('gulp-plumber');

gulp.task('stylus', function() {
  gulp.src('./app/css/styl/app.styl')
  .pipe(plumber())
  .pipe(stylus({
    use: nib(),
    sourcemap: {
      inline: true,
      basePath: './app/css/styl'
    }
  }))
  .pipe(gulp.dest('app/css'))
  .pipe(livereload({ auto: false }));
});