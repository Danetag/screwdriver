var gulp 			= require('gulp'),
	iconfont 		= require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	plumber 		= require('gulp-plumber'),
	config 			= require('../util/utils').getConfig(),
	fontName 		= 'iconfont';

gulp.task('iconfonts', function(){

  return gulp.src(config.iconfont.svg.src)
			  		.pipe(plumber())
			  		.pipe(iconfontCss({
				      fontName: fontName,
				      path: config.iconfont.css.src,
				      targetPath: config.iconfont.stylus.dest,
				      fontPath: config.iconfont.fontPath
				    }))
				    .pipe(iconfont({
				      fontName: fontName,
				      normalize: true,
				      appendCodepoints: true
				    }))
			    	.pipe(gulp.dest(config.iconfont.dest))
});
