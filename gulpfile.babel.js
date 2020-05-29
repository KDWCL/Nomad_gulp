import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
// 원래 commonjs 모듈을 사용하지만 es6 모듈 시스템을 사용하기 위해서는
// 파일이름을 gulpfile.babel.js가 필요하고 .babelrc에 preset-env를 설정해준다.
// @babel/core, @babel/register, @babel/preset-env 필요

const routes = {
  pug: {
    src: "src/*.pug",
    dest: "build",
  },
};
// 함수 하나하나가 task임. task의 역할은 pug -> html 트랜스파일링, scss-> css 트랜스파일링 등 임.

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));
// pipe에 파일들을 넣고 변형한다고 생각.
// gulp-pug 플러그인을 사용하여 pug template을 html로 변환시킴. gpug()

const clean = () => del(["build"]);
// build 디렉토리 삭제

const prepare = gulp.series([clean]);
// series를 사용하면 task를 용도별로 정리할 수 있음.

const assets = gulp.series([pug]);

export const dev = gulp.series([prepare, assets]);
// gulp dev를 하기 위해서는 export를 해줘야 한다.
