var gulp          = require('gulp');
    browserify    = require('browserify'),
    source        = require('vinyl-source-stream'),
    stringify     = require('stringify'),
    livereload    = require('gulp-livereload'),
    plumber       = require('gulp-plumber');

gulp.task('browserify', function(cb, err) {
  
  gulp.src('app/scripts/project/**/*.js')
  .pipe(plumber())
  .pipe(browserify({ 
    extensions: ['.html'], 
    paths: [ "app/scripts/project/", "app/scripts/project/app/", "node_modules", "tpl"], 
    entries: 'main',
    //transform: ["dotify/lib"],
    debug: true
  }).transform(stringify()).bundle())
  .pipe(source('project.js'))
  .pipe(gulp.dest('app/js'))
  .pipe(livereload({ auto: false }));
  cb(err);
  
});