const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');


gulp.task('serve', () => {

    browserSync.init({
        server: "./"
    });

    gulp.watch("./scss/**/*.scss", gulp.parallel('sass'));
    gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('sass', () => {
    return gulp.src("./scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.stream());
});


gulp.task('default', gulp.parallel('serve', 'sass'));

 
