var gulp    = require('gulp'),
    config  = require('../util/utils').getConfig();

gulp.task('copy', function(cb, err) {

  return gulp.src(config.copy.static.src)
    .pipe(gulp.dest(config.copy.static.dest));

});