/**
 * Created by superman on 16/11/4.
 */

const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', ()=>
    gulp.src('app.js')
        .pipe(babel({
          plugins: ['transform-runtime'],
          presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'))
);