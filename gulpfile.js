/* eslint-disable */
var gulp = require('gulp');
let uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var del = require('del'); 
const babel = require('gulp-babel');
var webpack = require('webpack-stream');
let cleanCSS = require('gulp-clean-css');

gulp.task('clean-js', function () {
	return del([
		'dev/assets/js/*.js'
	]);
});

gulp.task('clean-css', function () {
	return del([
		'dev/assets/css/*.css'
	]);
});

gulp.task('copy-css', function () {
	return gulp.src('assets/css/chunclockclock.css')
        .pipe(rev())
		.pipe(gulp.dest('dev/assets/css'))
        .pipe(rev.manifest('manifest_css.json'))
        .pipe(gulp.dest('build'));
});

gulp.task('copy-images', function () {
	return gulp.src('assets/css/*')
		.pipe(changed('dev/assets/css'))
		.pipe(gulp.dest('dev/assets/css'));
});

gulp.task("rev-replace", function() {
    var manifest = gulp.src("build/manifest.json");
    var manifestCSS = gulp.src("build/manifest_css.json");

    return gulp.src('src/index.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(revReplace({manifest: manifestCSS}))
        .pipe(gulp.dest('dev'));
});

gulp.task('pack-js',  gulp.series('clean-js', function () {
	return gulp.src('src/index.js')
	    .pipe(webpack({
			output: {
				filename: 'chunclockclock.js',
			},
	    })) 
        .pipe(rev())
        .pipe(gulp.dest('dev/assets/js'))
        .pipe(rev.manifest('manifest.json'))
        .pipe(gulp.dest('build'));
})); 

gulp.task('clean-js-prod', function () {
	return del([
		'dist/assets/js/*.js'
	]);
});

gulp.task('clean-css-prod', function () {
	return del([
		'dist/assets/css/*.css'
	]);
});

gulp.task('copy-css-prod', function () {
	return gulp.src('assets/css/chunclockclock.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rev())
		.pipe(gulp.dest('dist/assets/css'))
        .pipe(rev.manifest('manifest_css.json'))
        .pipe(gulp.dest('build'));
});

gulp.task("rev-replace-prod", function() {
    var manifest = gulp.src("build/manifest_prod.json");
    var manifestCSS = gulp.src("build/manifest_css.json");

    return gulp.src('src/index.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(revReplace({manifest: manifestCSS}))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', () => {
	return gulp.src('assets/css/*.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('dist/assets/css'));
});

gulp.task('prod',  gulp.series('clean-js-prod', 'clean-css-prod', 'copy-css-prod', function () {
	return gulp.src('src/index.js')
	    .pipe(webpack({
			output: {
				filename: 'chunclockclock.js',
			},
	    }))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify().on('error', function(e){
			console.log(e);
		}))
        .pipe(rev())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rev.manifest('manifest_prod.json'))
        .pipe(gulp.dest('build'));
}, 'rev-replace-prod')); 

gulp.task('watch', gulp.series('copy-css', 'pack-js', 'rev-replace', function() {
	gulp.watch('src/*.js', gulp.series('pack-js'));
	gulp.watch('src/index.html', gulp.series('rev-replace'));
	gulp.watch('build/manifest.json', gulp.series('rev-replace'));
	gulp.watch('assets/css/*.css', gulp.series('clean-css', 'copy-css', 'rev-replace'));
	//gulp.watch('assets/css/**/*.css', ['pack-css']);
}));

gulp.task('default', gulp.series('watch'));

/* eslint-enable */
