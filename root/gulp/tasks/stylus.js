var gulp          = require('gulp'),
    stylus        = require('gulp-stylus'),
    livereload    = require('gulp-livereload'),
    sourcemaps    = require('gulp-sourcemaps'),
    //autoprefixer  = require('autoprefixer-stylus'), //waiting for a fix
    autoprefixer  = require('gulp-autoprefixer'),
    plumber       = require('gulp-plumber');

gulp.task('stylus', function(cb, err) {
  gulp.src('./app/css/styl/app.styl')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus({
      //use: [autoprefixer()]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(autoprefixer())
    .pipe(livereload({ auto: false }));

  cb(err);
});