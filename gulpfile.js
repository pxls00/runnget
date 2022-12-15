// set PATH=./node_modules/.bin;%PATH%
// import package
import gulp from "gulp";
import browserSync from "browser-sync";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import { deleteAsync } from "del";

// import tasks
import images from "./gulp-tasks/images.js";
import js from "./gulp-tasks/js.js";
import pug from "./gulp-tasks/pug.js";
import sassTask from "./gulp-tasks/sass.js";
import svgStore from "./gulp-tasks/svg-store.js";
import svgStyles from "./gulp-tasks/svg-styles.js";
import transfer from "./gulp-tasks/transfer.js";

const sass = gulpSass(dartSass);

global.svgFileName = undefined;

var serverConfig = {
  server: {
    baseDir: "./dist",
  },
  ui: false,
  host: "localhost",
  port: 9000,
  open: false,
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false,
  },
};

var path = {
  svg: {
    svgFiles: "./src/svg/**/*.svg",
    unnecessary: "unnecessary-svg/svg-sprite.svg",
    template: "./src/sass/templates/_svg-tmplt.sass",
    templateDest: "sass/parts/_sprite.sass",
  },
  build: {
    pug: "dist",
    // less:	'dist/css',
    sass: "dist/css",
    js: "dist/js",
    fonts: "dist/fonts",
    images: "dist/images",
    svgTransfer: "dist/images/svg",
    jsonTransfer: "dist/json",
  },
  src: {
    pug: "src/*.pug",
    // less:	'src/less/*.less',
    sass: ["src/sass/*.sass", "src/sass/*.scss"],
    jsMinMap: ["./src/js/*.js", "!./src/js/_*.js"],
    js: "./src/js/_*.js",
    fonts: "src/fonts/**/*.*",
    images: "src/images/**/*.*",
    favicon: "src/favicon/**/*.*",
    svgTransfer: "src/svg-transfer/**/*.*",
    jsonTransfer: "src/json/**/*.*",
  },
  watch: {
    svgFiles: "./src/svg/**/*.svg",
    pug: "src/**/*.pug",
    less: "src/less/**/*.*",
    sass: ["src/sass/**/*.sass", "src/sass/**/*.scss"],
    js: "src/js/**/*.*",
    fonts: "src/fonts/**/*.*",
    images: "src/images/**/*.*",
    svgTransfer: "src/svg-transfer/**/*.*",
    jsonTransfer: "src/json/**/*.*",
  },
};

gulp.task("webserver", function () {
  browserSync(serverConfig);
});

gulp.task("reload", function (cb) {
  browserSync.reload();
  cb();
});

gulp.task("clean", function () {
  return deleteAsync(["./dist", "./src/unnecessary-svg"]);
});

gulp.task("clean-svg", function () {
  return deleteAsync(["./src/unnecessary-svg"]);
});

gulp.task("fonts", transfer(gulp, path.src.fonts, path.build.fonts));
gulp.task("favicon", transfer(gulp, path.src.favicon, path.build.pug));
gulp.task(
  "svgTransfer",
  transfer(gulp, path.src.svgTransfer, path.build.svgTransfer)
);
gulp.task(
  "jsonTransfer",
  transfer(gulp, path.src.jsonTransfer, path.build.jsonTransfer)
);

gulp.task("pug:dev", pug(path, gulp, global, true));
gulp.task("pug:prod", pug(path, gulp, global, false));

// gulp.task('less:dev', require('./gulp-tasks/less')(path, gulp, true));
// gulp.task('less:prod', require('./gulp-tasks/less')(path, gulp, false));

gulp.task("sass:dev", sassTask(path, gulp, sass, true));
gulp.task("sass:prod", sassTask(path, gulp, sass, false));

gulp.task("js:dev", js(path, gulp, true));
gulp.task("js:prod", js(path, gulp, false));

gulp.task("images:dev", transfer(gulp, path.src.images, path.build.images));
gulp.task("images:prod", images(path, gulp));

gulp.task("svg-styles", svgStyles(path, gulp));
gulp.task("svg-store", svgStore(path, gulp, svgFileName));

gulp.task("watch", function () {
  // Shows that run "watch" mode
  global.watch = true;

  gulp
    .watch(path.watch.pug, gulp.series("pug:dev", "reload"))
    .on("all", function (event, filepath) {
      global.emittyChangedFile = filepath;
    });

  // gulp.watch(path.watch.less, gulp.series('less:dev', 'reload'));
  gulp.watch(path.watch.sass, gulp.series("sass:dev", "reload"));
  gulp.watch(path.watch.js, gulp.series("js:dev", "reload"));
  gulp.watch(path.watch.images, gulp.series("images:dev", "reload"));
  gulp.watch(path.watch.svgTransfer, gulp.series("svgTransfer", "reload"));
  gulp.watch(path.watch.jsonTransfer, gulp.series("jsonTransfer", "reload"));

  gulp
    .watch(
      path.watch.svgFiles,
      gulp.series("svg-styles", "svg-store", "sass:dev", "reload")
    )
    .on("all", function (event, filepath) {
      console.log(filepath);
      var myregexp = /.*[\/\\]([^_]+)/;
      var match = myregexp.exec(filepath);
      global.svgFileName = match[1];
    });
});

gulp.task(
  "build:dev",
  gulp.series(
    "clean",
    "pug:dev",
    "svg-styles",
    "svg-store",
    // 'less:dev',
    "sass:dev",
    gulp.parallel(
      "js:dev",
      "fonts",
      "favicon",
      "images:dev",
      "svgTransfer",
      "jsonTransfer"
    )
  )
);

gulp.task(
  "build:prod",
  gulp.series(
    "clean",
    "pug:prod",
    "svg-styles",
    "svg-store",
    // 'less:prod',
    "sass:prod",
    gulp.parallel(
      "js:prod",
      "fonts",
      "favicon",
      "images:prod",
      "svgTransfer",
      "jsonTransfer"
    ),
    "clean-svg"
  )
);

gulp.task("dev", gulp.series("build:dev", gulp.parallel("watch", "webserver")));

gulp.task("build", gulp.series("build:prod"));
