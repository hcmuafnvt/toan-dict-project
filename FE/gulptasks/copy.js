module.exports = function(gulp) {
    gulp.task('copyfiles', function() {
        gulp.src(['bower_components/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('./public/js/libs/'));

        gulp.src(['bower_components/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('./public/css/libs/'));
    });
};