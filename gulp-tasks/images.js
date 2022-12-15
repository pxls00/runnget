import imagemin from "gulp-imagemin";
import pngquant from "imagemin-pngquant";
import gifsicle from "imagemin-gifsicle";
import mozjpeg from "imagemin-mozjpeg";
import svgo from "imagemin-svgo";
import webp from "gulp-webp";

export default function (path, gulp) {
  return function () {
    return gulp
      .src(path.src.images)
      .pipe(
        imagemin([
          gifsicle(),
          mozjpeg({
            quality: 90,
            progressive: true,
          }),
          pngquant({
            speed: 1,
            quality: [0.95, 1],
          }),
          svgo(),
        ])
      )
      .pipe(gulp.dest(path.build.images))
      .pipe(webp())
      .pipe(gulp.dest(path.build.images));
  };
}
