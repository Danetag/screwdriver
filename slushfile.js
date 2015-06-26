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
        '!' + __dirname + '/root/app/static/**',  // Exclude images to avoid Loadash issues 
        '!' + __dirname + '/root/app/scripts/vendor/**',  // Exclude vendros to avoid Loadash issues 
      ])  // Note use of __dirname to be relative to generator
      .pipe(template(answers))        // Lodash template support
      .pipe(gulp.dest('./'))          // Without __dirname here = relative to cwd
      .pipe(install())                // Run `bower install` and/or `npm install` if necessary
      .on('finish', function () {

        // Copy images
        gulp.src(__dirname + '/root/app/static/**')
            .pipe(gulp.dest('./app/static'))

        // Copy vendor
        gulp.src(__dirname + '/root/app/scripts/vendor/**')
            .pipe(gulp.dest('./app/scripts/vendor'))
            .on('finish', function () {
              done();                       // Finished!
            })

      });

  });

});