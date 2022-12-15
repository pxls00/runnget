/**
 *
 * @param {object} path - пути компиляции
 * @param gulp
 * @param {object} global - глобальные переменные
 * @param {object} plugins - gulp плагины
 * @param {boolean} dev - флаг
 * @returns {Function} - возврат таска
 */

import plumber from "gulp-plumber";
import notify from "gulp-notify";
import ifPlugin from "gulp-if";
import sourcemaps from 'gulp-sourcemaps'
import include from 'gulp-include'
import uglify from 'gulp-uglify'
import rename from 'gulp-rename'
import merge from 'merge-stream'

export default function (path, gulp, dev) {
  return function () {
    // Такс компиляции js файлов
    var jsMinMap = gulp
      .src(path.src.jsMinMap)
      .pipe(
        plumber({
          errorHandler: notify.onError({
            message: "<%= error.message %>",
            title: "JS Error!",
          }),
        })
      )
      .pipe(ifPlugin(dev, sourcemaps.init())) // Если dev - инициализируем запись sourcemaps
      .pipe(include()) // Обрабатываем подключения файлов
      .pipe(ifPlugin(dev, sourcemaps.write("../maps"))) // Если dev - пишем sourcemaps в отдельный файл
      .pipe(gulp.dest(path.build.js)) // Выкладываем файлы в dist
      .pipe(ifPlugin(!dev, uglify())) // Если не dev - минифицируем файлы
      .pipe(
        ifPlugin(
          !dev,
          rename({
            suffix: ".min", // Если не dev - добавляем суффикс .min
          })
        )
      )
      .pipe(ifPlugin(!dev, gulp.dest(path.build.js))); // Если не dev - выкладываем минифицированные файлы в dist

    // Такс компиляции статичных js файлов с префиксом
    var js = gulp
      .src(path.src.js)
      .pipe(
        plumber({
          errorHandler: notify.onError({
            message: "<%= error.message %>",
            title: "JS Error!",
          }),
        })
      )
      .pipe(
        rename(function (path) {
          path.basename = path.basename.replace(/_/, ""); // Удаляем префикс _
          return path;
        })
      )
      .pipe(gulp.dest(path.build.js));

    return merge(jsMinMap, js); // Мержим оба таска в один
  };
}
