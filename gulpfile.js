'use strict';

/**
 * # Contributing
 * ## Requirements
 * - [Gulp](http://gulpjs.com/)
 * ```bash
 * $ npm install -g gulp
 * ```
 * ## Running the test suite
 * ### Single Run:
 * ```bash
 * $ gulp
 * ```
 * ### Continuous testing when files are changed:
 * ```bash
 * $ gulp autotest
 * ```
 * ## Generating README.md
 * ```bash
 * $ gulp docs
 * ```
 * ## Notes
 * - jshint is part of the test suite and should be kept clean
 * - Pull requests should have high test coverage
 * - Docs should be kept up to date
 * - Additions should come with documentation
 * @module contributing
 */
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
    gulp.src(['*.js','test/*.js'])
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

gulp.task('autotest', function() {
    gulp.watch(['nodep.js', 'test/**/*.js'], ['test']);
});
