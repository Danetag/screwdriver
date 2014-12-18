var gulp          = require('gulp');
    browserify    = require('browserify'),
    source        = require('vinyl-source-stream'),
    stringify     = require('stringify');
    livereload    = require('gulp-livereload'),
    plumber       = require('gulp-plumber');

gulp.task('browserify', function(cb, err) {
  
  gulp.src('app/scripts/project/**/*.js')
  .pipe(plumber())
  .pipe(browserify({ 
    extensions: ['.js', '.html'], 
    paths: [ "app/scripts/project/", "app/scripts/", "app/scripts/project/app/", "node_modules"], 
    entries: 'main',
    //transform: ["stringify"],
    debug: true
  }).transform(stringify()).bundle())
  .pipe(source('project.js'))
  .pipe(gulp.dest('app/js'))
  .pipe(livereload({ auto: false }));
  cb(err);
  
});