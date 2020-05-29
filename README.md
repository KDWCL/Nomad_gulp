# Super Gulp

Learn Gulp by building an awesome development environment

[Live Demo](https://kdwcl.github.io/gulp/)

![gulpImage](https://user-images.githubusercontent.com/56942649/83271950-81890c00-a205-11ea-8b4e-1ac701dc7d22.png)

# 정리

- [x] prepare task = clean, img
- [x] assets task = pug, styles, js
- [x] live task = webserver, watch

```javascript
export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, ghDeploy, clean]);
```
