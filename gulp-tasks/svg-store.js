import merge from 'merge-stream'
import svgmin from 'gulp-svgmin'
import gpath from 'path'
import svgstore from 'gulp-svgstore'
import rename from 'gulp-rename'

export default function (path, gulp, svgFileName) {
  return function () {
    var svgSpritesName = ["sprite", "challenge"];
    if (global.svgFileName !== undefined) {
      svgSpritesName = [global.svgFileName];
    }

    var svgStoreMerge = merge();

    svgSpritesName.forEach(function (item, i, arr) {
      svgStoreMerge.add(
        gulp
          .src("./src/svg/**/" + item + "_*.svg")
          .pipe(
            svgmin(function (file) {
              var prefix = gpath.basename(
                file.relative,
                gpath.extname(file.relative)
              );
              return {
                plugins: [
                  {
                    cleanupIDs: {
                      prefix: prefix + "-",
                      minify: true,
                    },
                  },
                ],
              };
            })
          )
          .pipe(svgstore({ inlineSvg: true }))
          .pipe(
            rename({
              basename: item,
              suffix: "_icons",
              extname: ".svg",
            })
          )
          .pipe(gulp.dest("./dist/svgmin"))
      );
    });

    return svgStoreMerge;
  };
}
