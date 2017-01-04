var gulp = require('gulp');

var baseDir = "themes/default-bootstrap/",
	siteUrl = "footshop.tt";

var paths = {
	assetsDir: 		baseDir + "assets/",
	distDir: 		baseDir + "dist/",
	imagesAssets: 	baseDir + "assets/images/",
	imagesDist: 	baseDir + "dist/images/",
	jsAssets: 		baseDir + "assets/js/",
	jsDist: 		baseDir + "dist/js/",
	cssAssets: 		baseDir + "assets/sass/",
	cssDist: 		baseDir + "dist/css/",
	iconsAssets: 	baseDir + "assets/icons/",
};

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant'); // $ npm i -D imagemin-pngquant
var csso = require('gulp-csso');
var cache = require('gulp-cached');
var sort = require('gulp-sort');
var gutil = require('gulp-util');
var CssImporter = require('node-sass-css-importer')({
	import_paths: [ paths.iconsAssets ]
});
var postcss = require('gulp-postcss');
var rucksack = require('rucksack-css');
var babel = require('gulp-babel');
var debug = require('gulp-debug');
var newer = require('gulp-newer');


var browserSync = require('browser-sync').create();

// Lint Task
gulp.task('lint', function() {
	return gulp.src(paths.jsAssets + "*.js")
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Image minification
gulp.task('imagemin', function() {
	return gulp.src([paths.imagesAssets + "**/*", "!" + paths.imagesAssets + "{sprites,sprites/**}"])
		.pipe(cache('imagining'))
		.pipe(newer(paths.imagesDist))
		.pipe(imagemin({
			progressive: true,
			optimizationLevel: 3,
			use: [pngquant()]
		}))
		.pipe(gulp.dest(paths.imagesDist));
});

// Compile Our Sass
gulp.task('sass', function() {
	return gulp.src(paths.cssAssets + "*.scss")
		.pipe(sass({ importer: CssImporter }))
		.on('error', sass.logError)
		.pipe(postcss([ rucksack({
			autoprefixer: true
		}) ]))
		.pipe(gulp.dest(paths.cssDist))
		.pipe(browserSync.stream());
});

// Sprite generator
gulp.task('sprites', function() {
	var spriteData = gulp.src(paths.imagesAssets + "sprites/*.png").pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.scss',
		imgPath: '../images/sprite.png?' + (new Date().getTime()),	//this fixes cache problems
	}));

	spriteData.img.pipe(gulp.dest(paths.imagesDist)); // output path for the sprite
	spriteData.css.pipe(gulp.dest(paths.cssAssets + "plugins/")); // output path for the CSS

	return spriteData;
});

// Concatenate js files
gulp.task('scripts', function() {
	return gulp.src([paths.jsAssets + "**/*.js", "!" + paths.jsAssets + "{excluded,excluded/**}"])
		.pipe(sort({
			asc: true
		}))
		.pipe(concat('all.js'))
		// .pipe(babel({
		// 	presets: ['es2015']
		// }))
		.pipe(gulp.dest(paths.jsDist))
		.pipe(browserSync.stream());
});
// Concatenate and minify js files
gulp.task('scripts-build', function() {
	return gulp.src([paths.jsAssets + "**/*.js", "!" + paths.jsAssets + "{excluded,excluded/**}"])
		.pipe(sort({
			asc: true
		}))
		.pipe(concat('all.min.js'))
		// .pipe(babel({
		// 	presets: ['es2015']
		// }))
		.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest(paths.jsDist));
});

// Optimize css
gulp.task('csso', function () {
	return gulp.src(paths.cssDist + 'site.css')
		.pipe(rename('site.min.css'))
		.pipe(csso())
		.pipe(gulp.dest(paths.cssDist));
});

// Watch Files For Changes
gulp.task('watch', function() {

	// Browser syncing
	browserSync.init({
		proxy: siteUrl
	});

	gulp.watch(paths.jsAssets + "**/*.js", { interval: 500 }, ['scripts']);
	gulp.watch(paths.cssAssets + "**/*.scss", { interval: 500 }, ['sass']);
	gulp.watch(paths.imagesAssets + "sprites/*.png", { interval: 1000 }, ['sprites']);
	gulp.watch([paths.imagesAssets + "**/*", "!" + paths.imagesAssets + "{sprites,sprites/**}"], { interval: 1000 }, ['imagemin']);

	gulp.watch("{*,app/pages/*}.{php,html}", { interval: 1000 }).on("change", browserSync.reload);
});


gulp.task('build', ['sass', 'csso', 'scripts-build']);

// Default Task
gulp.task('default', ['sass', 'scripts', 'watch']);