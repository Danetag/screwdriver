var gulp        = require('gulp'),
    livereload  = require('gulp-livereload');

gulp.task('watch', function () {

  livereload.listen({ auto: true });
  
  gulp.watch('app/css/styl/*.styl', ['stylus']);
  gulp.watch('app/scripts/vendor/**/*.js', ['concatLib']);
  gulp.watch('app/scripts/project/**/*.js', ['buildJSProject']);
  
});
