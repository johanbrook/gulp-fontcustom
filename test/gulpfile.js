var gulp = require('gulp'),
    open = require('gulp-open'),
    es = require('event-stream'),
    fontcustom = require('../')

gulp.task('default', ['test-run'])

gulp.task('test-run', function() {
  gulp.src('./fixtures/*.svg')
  .pipe(fontcustom())
  .pipe(gulp.dest('./results'))
  .pipe(es.wait(function() {
    gulp.src('./results/fontcustom-preview.html')
    .pipe(open())
  }))
})
