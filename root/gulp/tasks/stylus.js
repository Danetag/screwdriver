var gulp          = require('gulp'),
    stylus        = require('gulp-stylus'),
    livereload    = require('gulp-livereload'),
    config        = require('../util/utils').getConfig(),
    sourcemaps    = require('gulp-sourcemaps'),
    autoprefixer  = require('gulp-autoprefixer'),
    plumber       = require('gulp-plumber');

gulp.task('stylus', function(cb, err) {

  return gulp.src(config.stylus.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.stylus.dest))
    .pipe(autoprefixer(config.stylus.autoprefixer))
    .pipe(livereload());

});