var gulp = require('gulp');
//var concat = require('gulp-concat');
//var rename = require('gulp-rename');
//var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var shell = require('gulp-shell');

var dist_files = ['www/**/*', 'js/**/*', 'css/**/*', '*.html'];

gulp.task('default', ['build']);

gulp.task('build', ['aws']);

gulp.task('aws', ['zip'], shell.task('./upload-to-s3'));

gulp.task('zip', function() {
  return gulp.src(['js/**/*','css/**/*'], {base: '.'})
    .pipe(zip('mvml-dist.zip'))
    .pipe(gulp.dest('dist'));
});

/*gulp.task('watch', function () {
  gulp.watch(dist_files, ['aws']);
});*/

/*gulp.task('compile', function() {
  return gulp.src(dist_files)
    .pipe(concat('concat.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('uglify.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/mvml.js'));
});*/

