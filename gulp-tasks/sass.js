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
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import webpcss from "gulp-webpcss";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import cssnano from "gulp-cssnano";
import rename from "gulp-rename";

export default function (path, gulp, sass, dev) {
  return function () {
    return gulp
      .src(path.src.sass)
      .pipe(
        plumber({
          errorHandler: notify.onError({
            message: "<%= error.message %>",
            title: "SASS Error!",
          }),
        })
      )
      .pipe(ifPlugin(dev, sourcemaps.init())) // Если dev - инициализируем запись sourcemaps
      .pipe(
        sass({
          // Компилируем sass файлы
          precision: 20,
        })
      )
      .pipe(
        autoprefixer({
          // Обрабатываем css через autoprefixer
          overrideBrowserslist: [
            "> 1%",
            "last 20 versions",
            "Firefox ESR",
            "Opera 12.1",
          ],
          cascade: true,
        })
      )
      .pipe(
        ifPlugin(
          !dev,
          webpcss({
            webpClass: ".webp",
            noWebpClass: ".no-webp",
            copyBackgroundSize: true,
          })
        )
      )
      .pipe(ifPlugin(dev, sourcemaps.write("../maps"))) // Если dev - пишем sourcemaps в отдельный файл
      .pipe(ifPlugin(!dev, groupCssMediaQueries()))
      .pipe(gulp.dest(path.build.sass)) // Выкладываем файлы в dist
      .pipe(
        ifPlugin(
          !dev,
          cssnano({
            // Если не dev - минифицируем файлы
            autoprefixer: { remove: false },
          })
        )
      )
      .pipe(
        ifPlugin(
          !dev,
          rename({
            suffix: ".min", // Если не dev - добавляем суффикс .min
          })
        )
      )
      .pipe(ifPlugin(!dev, gulp.dest(path.build.sass))); // Если не dev - выкладываем минифицированные файлы в dist
  };
}
