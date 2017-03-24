var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp) {
    gulp.task('browserify', function () {        
        var b = browserify({
            entries: './public/js/app.js',
            debug: true
        });

        b.bundle()
            .pipe(source('app.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            //.pipe(uglify())            
            .pipe(sourcemaps.write('./sourcemaps'))
            .pipe(gulp.dest('./public/js'));

        console.log('====> Browserify is built sucessfully!');
    });
};
