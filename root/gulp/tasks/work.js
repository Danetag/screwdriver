var gulp = require('gulp');

gulp.task('work', ['cleanJS', 'stylus', 'concatLib', 'buildJSProject'], function(cb, err){

  cb(err);
  
});