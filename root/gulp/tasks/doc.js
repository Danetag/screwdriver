var gulp   = require('gulp'),
    jsdoc  = require("gulp-jsdoc");


gulp.task('doc', [], function(cb, err) {
  return gulp.src("./app/scripts/project/**/*.js")
      .pipe(jsdoc('./doc'))
});
