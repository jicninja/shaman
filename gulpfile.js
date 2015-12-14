var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    htmlreplace = require('gulp-html-replace'),
    node,
    watch = require('gulp-watch'),
    uglify = require('gulp-uglifyjs'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-sass');
    runSequence = require('run-sequence'),
    concat = require('gulp-concat');


gulp.task('server', function() {
    if (node) node.kill();
    node = spawn('node', ['index.js'], {stdio: 'inherit'})
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

gulp.task('sass', function () {
    gulp.src('./public/assets/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./public/assets/sass/*.scss', ['sass']);
});

gulp.task('uglify', function() {
   return gulp.src('./public/app/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/app'))
});

gulp.task('htmlCompile', function() {
   return gulp.src('./public/index.html')
        .pipe(htmlreplace({
            'css': 'assets/styles.min.css',
            'js': '/app/app.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', function(){
    gulp.src('./public/**')
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function(){
    return gulp.src('./dist/**/*', {read: false})
         .pipe(rimraf());
});

gulp.task('dev', ['sass:watch'] , function(){
    gulp.watch('./public/**/*', [ 'copy']);
});

gulp.task('compile',function() {
    runSequence('clean', 'sass', 'uglify', 'htmlCompile');
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill();
});