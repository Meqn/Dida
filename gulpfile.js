const gulp = require('gulp')
const argv = require('yargs').argv
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const nano = require('gulp-cssnano')



gulp.task('sass', () => {
  gulp.src(['src/styles/*.scss', 'src/styles/scss/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
    .pipe(gulp.dest('src/styles/'))
    .pipe(replace(/(\/\/ .*)|(\/\*[\s\S]*?\*\/)/g, "")) 		// 去掉注释
    .pipe(nano({
      zindex: false,
      autoprefixer: false
    }))
    .pipe(rename({
      extname: '.wxss'
    }))
    .pipe(gulp.dest('weapp/libs/styles/'))
    .pipe(connect.reload());
})
gulp.task('watch', () => {
  gulp.watch('src/**', ['sass']);
})
gulp.task('server', function () {
  argv.p = argv.p || 3016;
  connect.server({
    name: 'lmq',
    root: 'src',
    port: argv.p,
    livereload: true
  });
});

gulp.task('default', ['sass'], () => {
  if (argv.w) {
    gulp.start('watch')
  }
  if (argv.s) {
    gulp.start('server')
  }
})








