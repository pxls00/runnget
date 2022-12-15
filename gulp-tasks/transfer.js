/**
 *
 * @param gulp
 * @param {string} filesPathFrom - путь откуда переносить
 * @param {string} filesPathTo - путь куда переносить
 * @returns {Function} - возврат таска
 */

import plumber from "gulp-plumber";
import notify from "gulp-notify";

export default function (gulp, filesPathFrom, filesPathTo) {
  return function () {
    return gulp
      .src(filesPathFrom)
      .pipe(
        plumber({
          errorHandler: notify.onError({
            message: "<%= error.message %>",
            title: "TRANSFER Error!",
          }),
        })
      )
      .pipe(gulp.dest(filesPathTo));
  };
}
