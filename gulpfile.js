var gulp = require('gulp');
var jade = require('gulp-jade');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var flatten = require('gulp-flatten');

var environment = 'development';
var paths = {
  src: './app/',
  dest: './public/',
  assets: './assets/'
}

gulp.task('set-production', function() {
  environment = 'production';
});

gulp.task('assets', function() {
  gulp.src(paths.assets + "**")
  .pipe(plumber())
  .pipe(gulp.dest(paths.dest));
});

gulp.task('vendor-styles', function() {
  var cssFilter = gulpFilter('*.css');

  return gulp.src(mainBowerFiles())

  .pipe(cssFilter)
  .pipe(plumber())
  .pipe(concat("vendor.css"))
  .pipe(gulp.dest(paths.dest + 'css/'))
  .pipe(minify())
  .pipe(gulp.dest(paths.dest + 'css/'))
});

gulp.task('vendor-scripts', function() {
  var jsFilter = gulpFilter('*.js');

  return gulp.src(mainBowerFiles())

  .pipe(jsFilter)
  .pipe(plumber())
  .pipe(concat("vendor.js"))
  .pipe(gulp.dest(paths.dest + 'js/'))
  .pipe(uglify())
  .pipe(gulp.dest(paths.dest + 'js/'))
});

gulp.task('vendor-fonts', function() {
  var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);

  return gulp.src(mainBowerFiles())

  .pipe(fontFilter)
  .pipe(flatten())
  .pipe(gulp.dest(paths.dest + 'font/roboto/'));
});

gulp.task('scripts', function() {
  stream = gulp.src(paths.src + 'js/app.coffee', { read: false })
  .pipe(plumber())
  .pipe(browserify({
    debug: environment == 'development',
    transform: ['coffeeify', 'jadeify'],
    extensions: ['.coffee', '.jade']
  }))
  .pipe(concat('index.js'))

  if (environment == 'production') {
    stream.pipe(uglify())
  }

  stream.pipe(gulp.dest(paths.dest + 'js/'))
});

gulp.task('html', function() {
  gulp.src(paths.src + 'index.jade')
  .pipe(plumber())
  .pipe(jade({
    pretty: environment == 'development'
  }))
  .pipe(gulp.dest(paths.dest))
});

gulp.task('styles', function () {
  stream = gulp.src(paths.src + 'styles/**/*.sass')
  .pipe(plumber())
  .pipe(sass().on('error', sass.logError))

  if (environment == 'production') {
    stream.pipe(minify())
  }

  stream.pipe(gulp.dest(paths.dest + 'css/'))
});

gulp.task('watch', function () {
  var server = livereload();

  gulp.watch(paths.src + 'js/**', ['scripts']);
  gulp.watch(paths.src + 'styles/**/*.sass', ['styles']);
  gulp.watch(paths.src + 'index.jade', ['html']);

  gulp.watch([
    paths.dest + 'js/*.js',
    paths.dest + 'css/*.css',
    paths.dest + '**/*.html'
  ], function(evt) {
    server.changed(evt.path);
  });
});

gulp.task('vendor', ['vendor-styles', 'vendor-scripts', 'vendor-fonts']);
gulp.task('compile', ['html', 'styles', 'scripts']);

gulp.task('default', ['assets', 'vendor', 'compile']);
gulp.task('production', ['set-production', 'default']);
