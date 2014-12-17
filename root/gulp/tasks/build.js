var gulp = require('gulp');

gulp.task('copyAndImgMin', ['copy'], function(cb, err){
  gulp.start('imgmin');
  cb(err);
});

gulp.task('build', [ 'work', 'copyAndImgMin'], function(){
  gulp.start('minify');
  gulp.start('uglify');
});