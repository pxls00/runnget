/**
 *
 * @param {object} path - пути компиляции
 * @param gulp
 * @param {object} global - глобальные переменные
 * @param {object} plugins - gulp плагины
 * @param {boolean} dev - флаг
 * @returns {Function} - возврат таска
 */

export default function (path, gulp, plugins, dev) {
  return function () {
    return gulp
      .src(path.src.less)
      .pipe(
        plugins.plumber({
          errorHandler: plugins.notify.onError({
            message: "<%= error.message %>",
            title: "LESS Error!",
          }),
        })
      )
      .pipe(plugins.if(dev, plugins.sourcemaps.init())) // Если dev - инициализируем запись sourcemaps
      .pipe(
        plugins.less({
          // Компилируем less файлы
          paths: [plugins.path.join(__dirname, "../src/less", "includes")],
        })
      )
      .pipe(
        plugins.autoprefixer({
          // Обрабатываем css через autoprefixer
          browsers: ["> 1%", "last 20 versions", "Firefox ESR", "Opera 12.1"],
          cascade: true,
        })
      )
      .pipe(plugins.if(dev, plugins.sourcemaps.write("../maps"))) // Если dev - пишем sourcemaps в отдельный файл
      .pipe(gulp.dest(path.build.less)) // Выкладываем файлы в dist
      .pipe(
        plugins.if(
          !dev,
          plugins.cssnano({
            // Если не dev - минифицируем файлы
            autoprefixer: { remove: false },
          })
        )
      )
      .pipe(
        plugins.if(
          !dev,
          plugins.rename({
            suffix: ".min", // Если не dev - добавляем суффикс .min
          })
        )
      )
      .pipe(plugins.if(!dev, gulp.dest(path.build.less))); // Если не dev - выкладываем минифицированные файлы в dist
  };
}
