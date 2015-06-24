var gulp          = require('gulp'),
    watchify      = require('watchify'),
    browserify    = require('browserify'),
    gutil         = require('gulp-util'),
    source        = require('vinyl-source-stream'),
    stringify     = require('stringify'),
    Utils         = require('../util/utils'),
    config        = Utils.getConfig(),
    plumber       = require('gulp-plumber');

gulp.task('browserify', function(cb, err) {

  return browserifyTask();

});

var browserifyTask = function() {

  var isWatching    = Utils.watching();

  var b = browserify({ 
      cache: {},
      packageCache: {},
      fullPaths: true,
      extensions: ['.html'], 
      paths: config.browserify.paths,
      debug: true
  });

  if (isWatching) {

    // wrap browserify into a watchify.
    b = watchify(b);

    b.on('update', function(){
      bundleBrowserify(b);
    });

    b.on('log', gutil.log); // output build logs to terminal

  }

  b.add(config.browserify.entry)
  return bundleBrowserify(b);

}

var bundleBrowserify = function(b) {

  return b.transform(stringify()).bundle()
    .pipe(plumber())
    .pipe(source(config.browserify.source))
    .pipe(gulp.dest(config.browserify.dest));
}