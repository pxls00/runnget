/**
 *
 * @param {object} path - пути компиляции
 * @param gulp
 * @param {object} global - глобальные переменные
 * @param {object} plugins - gulp плагины
 * @param {boolean} dev - флаг
 * @returns {Function} - возврат таска
 */
import emitty from "emitty";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import ifPlugin from "gulp-if";
import pug from "gulp-pug";
import replace from "gulp-replace";
import versionNumber from "gulp-version-number";

const emittyPlugin = emitty.setup("src", "pug");

export default function (path, gulp, global, dev) {
  if (dev) {
    return function () {
      // https://www.npmjs.com/package/emitty
      return new Promise(function (resolve, reject) {
        emittyPlugin.scan(global.changedStyleFile).then(function () {
          gulp
            .src(path.src.pug)
            .pipe(
              plumber({
                errorHandler: notify.onError({
                  message: "<%= error.message %>",
                  title: "PUG Error!",
                }),
              })
            )
            .pipe(
              ifPlugin(global.watch, emittyPlugin.filter(global.emittyChangedFile))
            )
            .pipe(pug({ pretty: true }))
            .pipe(gulp.dest(path.build.pug))
            .on("end", resolve)
            .on("error", reject);
        });
      });
    };
  } else {
    return function () {
      return gulp
        .src(path.src.pug)
        .pipe(
          plumber({
            errorHandler: notify.onError({
              message: "<%= error.message %>",
              title: "PUG Error!",
            }),
          })
        )
        .pipe(pug({ pretty: true })) // компиляция pug файлов
        .pipe(replace("main.css", "main.min.css"))
        .pipe(replace("scripts.js", "scripts.min.js"))
        .pipe(replace("vendor.js", "vendor.min.js"))
        .pipe(replace("jquery-2.2.4.js", "jquery-2.2.4.min.js"))
        .pipe(
          versionNumber({
            value: "%DT%",
            append: {
              key: "_v",
              cover: 0,
              to: [
                "css",
                {
                  type: "js",
                  files: ["scripts.min.js"],
                },
              ],
            },
          })
        )
        .pipe(gulp.dest(path.build.pug));
    };
  }
}
