var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var fs = require('fs');

gulp.task('jshint', function() {
    gulp.src(['gulpfile.js', 'nodep.js', 'test/**/*.js'])
        .pipe(gp.jshint('.jshintrc'))
        .pipe(gp.jshint.reporter('jshint-stylish'));
});

gulp.task('spec', function() {
    gulp.src('nodep.js')
        .pipe(gp.istanbul())
        .pipe(gp.istanbul.hookRequire())
        .on('finish', function() {
            gulp.src('test/spec.js')
                .pipe(gp.mocha())
                .pipe(gp.istanbul.writeReports());
        });
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

gulp.task('coverage', function()  {
    gulp.src('coverage/**/lcov.info')
        .pipe(gp.coveralls());
});

gulp.task('default', ['test']);

