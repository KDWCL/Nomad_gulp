import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import nsass from "node-sass";
sass.compiler = nsass;
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";
/* gulp란? 
gulp는 반복적으로 수행하게 되는 일인 파일용량 줄이기 위한 압축, 병합 등과 같은 수정작업이 일어나면 반복적으로 해야할 일들을 자동적으로 처리해주는 자동화 빌드 시스템입니다.
출처: https://woonghub.tistory.com/58 [개발허브]
*/

// 원래 commonjs 모듈을 사용하지만 es6 모듈 시스템을 사용하기 위해서는
// 파일이름을 gulpfile.babel.js가 필요하고 .babelrc에 preset-env를 설정해준다.
// @babel/core, @babel/register, @babel/preset-env 필요

const routes = {
  pug: {
    watch: "src/**/*.pug",
    // 모든 pug 파일들의 수정을 보고 싶기 때문에 watch경로를 새로 만들어서 설정해준다.
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/styles.scss",
    dest: "build/scss",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};
// 함수 하나하나가 task임. task의 역할은 pug -> html 트랜스파일링, scss-> css 트랜스파일링 등 임.

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
// pipe에 파일들을 넣고 변형한다고 생각.
// gulp-pug 플러그인을 사용하여 pug template을 html로 변환시킴. gpug()

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));
// open: true를 하면 창을 자동으로 띄워줌.
// https://www.npmjs.com/package/gulp-webserver <- 옵션확인
// gulp 명령어 사용 시 바로 웹을 띄워주는 역할을 수행. gulp-connect도 있음.

const clean = () => del(["build", ".publish"]);
// build 디렉토리 삭제

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));
// 이미지 최적화(용량 크기를 줄여준다.)

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"], // default, 지원하는 브라우저가 커질 수록 느려짐.
      })
    )
    .pipe(miniCSS()) // gulp-csso로 minify(최소화)해줌. 공백을 없애준다.
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }], // uglifyify는 띄워쓰기 같은 것들을 좀 더 압축해준다.
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const ghDeploy = () => gulp.src("build/**/*").pipe(ghPages());
// option으로 remoteURL을 넣어줄 수 있다. 바꾸기 위해선 레포지토리도 바꿔줘야 한다.

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};
// 계속 watch할 경로를 정해준다. watch: "src/**/*.pug"
// 두번째 인자는 지정한 경로에 있는 파일이 변경되었을 때 어떤 task를 실행할지이다.

const prepare = gulp.series([clean, img]);
// series를 사용하면 task를 용도별로 정리할 수 있음.

const assets = gulp.series([pug, styles, js]);

const live = gulp.parallel([webserver, watch]);
// 두개의 task를 동시에 실행시키고 싶다면 parallel을 사용한다.
// 원래 Starting -> Finished가 되고나서 다음 task가 Starting이 되어야 하는데
// 두개가 동시에 Starting이 된다.

export const build = gulp.series([prepare, assets]);
// live만 빼고 실행
export const dev = gulp.series([build, live]);
// gulp dev를 하기 위해서는 export를 해줘야 한다.
export const deploy = gulp.series([build, ghDeploy, clean]);
// build를 실행시키고 deploy를 한다.
