var gulp = require('gulp');
var gp = require('gulp-load-plugins')();

gulp.task('jshint', function() {
    gulp.src(['gulpfile.js', 'nodep.js', 'test/**/*.js'])
        .pipe(gp.jshint('.jshintrc'))
        .pipe(gp.jshint.reporter('jshint-stylish'));
});

gulp.task('spec', function() {
    gulp.src('test/spec.js')
        .pipe(gp.jasmine());
});

gulp.task('test', [
    'jshint',
    'spec'
]);
