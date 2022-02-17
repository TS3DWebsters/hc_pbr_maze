const gulp = require("gulp");
const ts = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function() {

    let tsProject = ts.createProject("tsconfig.json");

    return gulp.src('ts/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.mapSources(function(sourcePath, file) {
        return "../" + sourcePath;
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("js"));
});