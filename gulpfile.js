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
gulp.task('copyDev', function () {
    gulp.watch( ['./public/**/*','./public/**/**/*'], ['copy']);
});


gulp.task('uglify:vendor', function() {
    return gulp.src(['./public/app/pixi.js','./public/app/socketio.js','./public/app/lodash.js','./public/app/hammer.js'])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/app'))
});

gulp.task('uglify:app', function() {
   return gulp.src(['!./public/app/pixi.js','!./public/app/socketio.js','!./public/app/lodash.js','!./public/app/hammer.js','./public/app/*.js'])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/app'))
});

gulp.task('htmlCompile', function() {
   return gulp.src('./public/index.html')
        .pipe(htmlreplace({
            'css': 'assets/styles.min.css',
            'vendor': 'app/vendor.js',
            'js': 'app/app.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', function(){
    gulp.src('./public/**')
        .pipe(gulp.dest('./dist'));
});

gulp.task('copyImages', function(){
    gulp.src('./public/assets/*.png')
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('clean', function(){
    return gulp.src('./dist/**/*', {read: false})
         .pipe(rimraf());
});

gulp.task('dev', ['sass:watch', 'copyDev', 'server'] );

gulp.task('compile',function() {
    runSequence('clean', 'sass', 'copyImages', 'uglify:vendor','uglify:app', 'htmlCompile');
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill();
});