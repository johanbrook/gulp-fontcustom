var gulp = require('gulp'),
    mocha = require('gulp-mocha')

gulp.task('default', ['test'])

gulp.task('test', function() {
  gulp.src('test/tests.js')
  .pipe(mocha({ reporter: "spec" }))
})
