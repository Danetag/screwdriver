var gulp     = require('gulp'),
    install  = require('gulp-install'),
    template = require('gulp-template'),
    inquirer = require('inquirer');

gulp.task('default', function (done) {

  inquirer.prompt([
    {type: 'input', name: 'name', message: 'Give your project a name (lowercase)', default: "my-project"},
    {type: 'input', name: 'title', message: 'Give your project a title', default: "My Project"},
    {type: 'input', name: 'description', message: 'Give your project a description', default:"Best project ever"}, // Get app name from arguments by default,
    {type: 'confirm', name: 'moveon', message: 'Continue?'}
  ],
  

  function (answers) {
    if (!answers.moveon) {
      return done();
    }

    gulp.src([
        __dirname + '/root/**',
        '!' + __dirname + '/root/app/img/**',  // Exclude images to avoid Loadash issues 
      ])  // Note use of __dirname to be relative to generator
      .pipe(template(answers))        // Lodash template support
      .pipe(gulp.dest('./'))          // Without __dirname here = relative to cwd
      .pipe(install())                // Run `bower install` and/or `npm install` if necessary
      .on('finish', function () {

        // Copy images
        gulp.src(__dirname + '/root/app/img/**')
            .pipe(gulp.dest('./app/img'))
            .on('finish', function () {
              done();                       // Finished!
            })

      });

  });

});