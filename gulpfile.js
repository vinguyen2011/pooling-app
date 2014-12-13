var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp
    .task('serve', function () {
        browserSync({ server: { baseDir: 'app' } });
        gulp.watch([
            './*.js',
            './*.html',
            './css/**/*.css',
            './js/**/*.js',
            './tpl/**/*.html'
        ], { cwd: 'app' }, reload);
    })
    .task('default', ['serve']);
