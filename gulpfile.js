var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var fs = require('fs');

gulp.task('jshint', function() {
    gulp.src(['gulpfile.js', 'nodep.js', 'test/**/*.js'])
        .pipe(gp.jshint('.jshintrc'))
        .pipe(gp.jshint.reporter('jshint-stylish'));
});

gulp.task('spec', function() {
    gulp.src('test/spec.js')
        .pipe(gp.mocha());
});

gulp.task('test', [
    'jshint',
    'spec'
]);

gulp.task('docs', function() {
    gulp.src('nodep.js')
        .pipe(gp.concat('README.md'))
        .pipe(gp.jsdocToMarkdown({
            template: fs.readFileSync('./docs.hbs', 'utf8')
        })).pipe(gulp.dest('.'));
});

gulp.task('default', ['test']);

