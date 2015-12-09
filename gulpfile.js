var gulp = require('gulp'),
  jade = require('gulp-jade'),
  babel = require('gulp-babel'),
  watch = require('gulp-watch'),
  csslint = require('gulp-csslint');

/** Jade **/
gulp.task('jade', function() {
  return gulp.src('./src/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./app'));
});

gulp.task('css', function() {
  gulp.src('src/**/*.css')
    .pipe(csslint())
    .pipe(csslint.reporter())
    .pipe(gulp.dest('./app'));
});
/** Babel **/
gulp.task('babel', function() {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./app'));
});
/** Watch **/
gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['babel']);
  gulp.watch('./src/**/*.jade', ['jade']);
  gulp.watch('./src/**/*.css', ['css']);
});

/** Default task **/
gulp.task('default', ['babel', 'jade', 'css', 'watch']);
