'use strict';

var browserify = require('browserify');
var del = require('del');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var glob = require('glob');
var Server = require('karma').Server;
var gulp = require('gulp');

// Load all gulp plugins listed in package.json
var gulpPlugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// Define file path variables
var paths = {
    root: 'app/',      // App root path
    src:  'app/src/',   // Source path
    dist: 'app/dist/', // Distribution path
    test: 'test/',     // Test path
};

/*
 * Useful tasks:
 * - gulp browserify:
 *   - linting
 *   - unit tests
 *   - browserification
 *   - no minification, does not start server.
 * - gulp watch:
 *   - starts server with live reload enabled
 *   - lints, unit tests, browserifies and live-reloads changes in browser
 *   - no minification
 * - gulp:
 *   - linting
 *   - unit tests
 *   - browserification
 *   - minification and browserification of minified sources
 *   - start server for e2e tests
 *   - run Protractor End-to-end tests
 *   - stop server immediately when e2e tests have finished
 *
 * At development time, you should usually just have 'gulp watch' running in the
 * background all the time. Use 'gulp' before releases.
 */

gulp.task('clean', function () {
    return del([paths.root + 'ngAnnotate', paths.dist + '/**/*']);
});

gulp.task('lint', function () {
    return gulp
        .src(['gulpfile.js',
            paths.src + '**/*.js',
            paths.test + '**/*.js',
            '!' + paths.test + 'browserified/**',
        ])
        .pipe(gulpPlugins.eslint())
        .pipe(gulpPlugins.eslint.format());
});

gulp.task('unit', function () {
    return gulp
        .src([paths.test + 'unit/**/*.js'])
        .pipe(gulpPlugins.mocha({reporter: 'dot'}));
});

gulp.task('browserify', ['clean', 'lint', 'unit'], function () {
    return browserify(paths.src + 'app.js', {debug: true})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(paths.dist))
        .pipe(gulpPlugins.connect.reload());
});

gulp.task('ngAnnotate', ['lint', 'unit'], function () {
    return gulp
        .src([paths.src + '**/*.js',])
        .pipe(gulpPlugins.ngAnnotate())
        .pipe(gulp.dest(paths.root + 'ngAnnotate'));
});

gulp.task('browserify-min', ['ngAnnotate'], function () {
    return browserify(paths.root + 'ngAnnotate/app.js')
        .bundle()
        .pipe(source('app.min.js'))
        .pipe(gulpPlugins.streamify(gulpPlugins.uglify({mangle: false})))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('browserify-tests', function () {
    var bundler = browserify({debug: true});
    glob
        .sync(paths.test + 'unit/**/*.js')
        .forEach(function (file) {
            bundler.add(file);
        });

    return bundler
        .bundle()
        .pipe(source('browserified_tests.js'))
        .pipe(gulp.dest(paths.test + 'browserified'));
});

gulp.task('karma', ['browserify-tests'], function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('server', ['browserify'], function () {
    gulpPlugins.connect.server({
        root: 'app',
    });
});

gulp.task('server-livereload', ['browserify'], function () {
    gulpPlugins.connect.server({
        root: 'app',
        livereload: true,
    });
});

gulp.task('e2e', ['server'], function () {
    return gulp
        .src([paths.test + 'e2e/**/*.js'])
        .pipe(gulpPlugins.protractor.protractor({
            configFile: 'protractor.conf.js',
            args: ['--baseUrl', 'http://127.0.0.1:8080'],
        }))
        .on('error', function (e) {
            throw e;
        })
        .on('end', function () {
            gulpPlugins.connect.serverClose();
        });
});

gulp.task('watch', ['server-livereload'], function () {
    gulp.watch([
        paths.root + '*.{html,js}',
        paths.src + '**/*.{html,js}',
        paths.test + '**/*.js',
    ], ['browserify']);
});

gulp.task('default', ['clean'], function () {
    gulp.start('karma', 'browserify', 'browserify-min', 'e2e');
});
