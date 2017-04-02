var uglify = require('gulp-uglify'),    
    concat = require('gulp-concat');

module.exports = function(gulp) {
    gulp.task('uglify', function () {        
        var libs = gulp.src(['./public/js/libs/jquery.min.js', './public/js/libs/**/*.js']);        
        libs.pipe(concat('libs.min.js'))
            .pipe(uglify())            
            .pipe(gulp.dest('./public/js'));
             
        console.log('====> Uglify js libs are built sucessfully!');
    });
};
