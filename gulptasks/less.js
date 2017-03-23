var less = require('gulp-less'),
    merge = require('merge-stream'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = function (gulp) {
    gulp.task('less', function () {
        //compile less
        var lessStream = gulp.src(['./less/style.less'])
            .pipe(less())
            .pipe(gulp.dest('./public/css'));

        //select additional css lib files
        cssLibsStream = gulp.src('./public/css/libs/**/*.css');

        //merge the two streams and concatenate their contents into a single file
        merge(lessStream, cssLibsStream)
            .pipe(sourcemaps.init())
            .pipe(minifyCss())
            .pipe(concat('style.min.css'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./public/css'));

        console.log('====> Less & Concat are built sucessfully!');
    });
};