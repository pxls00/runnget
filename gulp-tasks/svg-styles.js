import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import svgSprite from 'gulp-svg-sprite'
import replace from 'gulp-replace'

export default function (path, gulp) {
  return function () {
    var config = {
      dest: ".",
      mode: {
        css: {
          dest: ".",
          prefix: "&-%s",
          dimensions: "%s",
          sprite: path.svg.unnecessary,
          render: {
            sass: {
              template: path.svg.template,
              dest: path.svg.templateDest,
            },
          },
        },
      },
    };
    return gulp
      .src(path.svg.svgFiles)
      .pipe(
        plumber({
          errorHandler: notify.onError({
            message: "<%= error.message %>",
            title: "SVG SASS Error!",
          }),
        })
      )
      .pipe(svgSprite(config))
      .pipe(replace("&amp;", "&"))
      .pipe(gulp.dest("./src"));
  };
}
