const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');

gulp.task('default', ['lint', 'test'], () => {
  console.log('started');
});

gulp.task('lint', () => {
  gulp.src('/lib/bit-transform.js')
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('test', () => {
  gulp.src('test/*.js')
  .pipe(mocha());
});
