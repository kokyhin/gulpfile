const gulp = require('gulp');
const pug = require('gulp-pug');
const connect = require('gulp-connect');
const minifyCSS = require('gulp-csso');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const gUtil = require('gulp-util');
const autoprefixer = require ('gulp-autoprefixer');
const runSequence = require ('run-sequence');
const del = require('del')
const notify = require ('gulp-notify');

const source = './source'
const dist = './dist'

const plumberConfig = {
  errorHandler: function(error) {
    gUtil.log(gUtil.colors.cyan('Plumber') + gUtil.colors.red(' found Error:\n'), error.toString());
    notify.onError()(error);
    return this.emit('end');
  }
};

gulp.task('convert-pug', function() {
  return gulp.src(`${source}/*.pug`)
    .pipe(plumber(plumberConfig))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(dist))
    .pipe(connect.reload());
});

gulp.task('copy', () => {
  gulp.src([`${source}/js/**`, `${source}/img/**`, `${source}/fonts/**`, `${source}/css/*.css`], {base: source}).pipe(gulp.dest(dist));
});

gulp.task('clean', (cb) => {
  return del([`${dist}/**`, `!${dist}`], cb);
});

gulp.task('convert-sass', () => {
  return gulp.src(`${source}/css/*.scss`)
    .pipe(plumber(plumberConfig))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(`${dist}/css`))
    .pipe(connect.reload());
});

gulp.task('watch', ['copy', 'convert-sass', 'convert-pug'], () => {
  gulp.watch(`${source}/*.pug`, ['convert-pug']);
  gulp.watch(`${source}/css/*.scss`, ['convert-sass']);
  return gulp.watch(`${source}/`, ['copy']);
});

gulp.task('default', () => {
  return runSequence('clean', ['watch']);
});

gulp.task('serve', ['default'], () => {
  connect.server({
    root: dist,
    livereload: true
  });
});