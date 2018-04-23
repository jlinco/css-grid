var gulp = require('gulp');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var browserSync = require('browser-sync');
var spawn = require('cross-spawn');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var htmlmin = require('gulp-htmlmin');

var reload = browserSync.reload;

// autorealod gulp on gulpfile.js update
gulp.task('gulp-autoreload', function() {
    // Store current process if any
    var p;
  
    gulp.watch('gulpfile.js', spawnChildren);
    // Comment the line below if you start your server by yourself anywhere else
    spawnChildren();
  
    function spawnChildren(e) {
      if(p) {
          p.kill();
      }
  
      p = spawn('gulp', ['default'], {stdio: 'inherit'});
    }
});

// watch files for changes and reload
gulp.task('serve-dev', function() {
    browserSync({
      server: {
        baseDir: 'app',
        // index: "sidebar-layout.html",
        index: "index.html"
  
      }
    });
  
    gulp.watch('gulpfile.js', ['gulp-autoreload']);
    // gulp.watch('app/scss/*.scss', ['sass-dev', reload]);
    gulp.watch(['app/*.html', 'app/**/*.html', 'app/css/*.css', 'app/js/*.js', 'app/js/**/*.js'], reload);
});

gulp.task('default', ['serve-dev']);

// cleans the distribution folder
gulp.task('clean:dist', function() {
    return del.sync('dist');
});

// optimizses all images
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});
  
// copies over the fonts used
gulp.task('fonts', function(){
    return gulp.src('app/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'));
});
  
// batches files and minifies them
gulp.task('batch-and-minify', function(){
    return gulp.src(['app/*.html', 'app/*/*.html'])
      .pipe(useref())
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulpIf('*.js', uglify()))
      .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
      .pipe(gulp.dest('dist'));
});
  
gulp.task('prod', ['clean:dist', 'images', 'fonts', 'batch-and-minify']);
  
gulp.task('serve-prod', function() {
    browserSync({
      server: {
        baseDir: 'dist',
        index: "index.html"
      }
    });
});