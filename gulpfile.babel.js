import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
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

const clean = () => del(["build"]);
// build 디렉토리 삭제

const watch = () => gulp.watch(routes.pug.watch, pug);
// 계속 watch할 경로를 정해준다. watch: "src/**/*.pug"
// 두번째 인자는 지정한 경로에 있는 파일이 변경되었을 때 어떤 task를 실행할지이다.

const prepare = gulp.series([clean]);
// series를 사용하면 task를 용도별로 정리할 수 있음.

const assets = gulp.series([pug]);

const postDev = gulp.parallel([webserver, watch]);
// 두개의 task를 동시에 실행시키고 싶다면 parallel을 사용한다.
// 원래 Starting -> Finished가 되고나서 다음 task가 Starting이 되어야 하는데
// 두개가 동시에 Starting이 된다.

export const dev = gulp.series([prepare, assets, postDev]);
// gulp dev를 하기 위해서는 export를 해줘야 한다.
