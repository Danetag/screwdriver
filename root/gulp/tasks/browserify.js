var gulp          = require('gulp');
    browserify    = require('browserify'),
    source        = require('vinyl-source-stream'),
    livereload    = require('gulp-livereload'),
    watchify      = require('watchify');

gulp.task('browserify', function() {
  
  gulp.src('./app/js/project/**/*.js')
  .pipe(browserify({
    // Specify the entry point of your app
    entries: './app/js/project/main.js',
    // Add file extentions to make optional in your requires
    extensions: ['.js'],
    // Enable source maps!
    debug: true
  }).bundle())
  // Use vinyl-source-stream to make the
  // stream gulp compatible. Specifiy the
  // desired output filename here.
  .pipe(source('app.js'))
  // Specify the output destination
  .pipe(gulp.dest('./app/js'))
  .pipe(livereload({ auto: false }));

});