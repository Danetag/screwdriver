var gulp = require('gulp');

gulp.task('work', ['cleanJS', 'compass', 'concatLib', 'buildJSProject'], function(cb, err){

  cb(err);
  
});