var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var inject = require('gulp-inject');
var webserver = require('gulp-webserver');


gulp.task('styles', function() {
   return  gulp.src('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css/'));

});

gulp.task('minify', ['styles'], function(){
     return gulp.src(['./assets/css/*.css', '!./assets/css/*.min.css'])
        .pipe(cleanCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./assets/css/'))
})

gulp.task('inject-dev', ['styles'], function(){
     var sources = gulp.src(['./assets/css/*.css', '!./assets/css/*.min.css'], {read: false});

    return gulp.src('./index.html')
            .pipe(inject(sources))
            .pipe(gulp.dest('.'));
})

gulp.task('inject-start', ['minify'], function(){
    var sources = gulp.src(['./assets/css/*.min.css'], {read: false});

   return gulp.src('./index.html')
        .pipe(inject(sources))
        .pipe(gulp.dest('.'));
})

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
        host: 'localhost',
        path: '/',
        port: 4200,
        livereload: true
    }));
});

//Watch task
gulp.task('watch',function() {
    gulp.watch('*.html',['styles']);
    gulp.watch('assets/sass/**/*.scss',['styles']);
});

gulp.task('start', ['styles', 'minify', 'inject-start', 'webserver']);
gulp.task('default', ['styles', 'inject-dev', 'webserver', 'watch']);