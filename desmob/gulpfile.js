'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;

var path = {
	mobile: {
		build: {
			html: 'prod/mobile/',
			js: 'prod/mobile/static/js/',
			css: 'prod/mobile/static/css/',
			img: 'prod/mobile/static/img/',
			fonts: 'prod/mobile/static/fonts/'
		},
		src: {
			html: 'dev/mobile/*.html',
			js: 'dev/js/mobile.js',
			style: 'dev/sass/mobile.scss',
			img: 'dev/mobile/img/**/*.*',
			fonts: 'dev/fonts/**/*.*'
		},
		watch: {
			html: 'dev/mobile/**/*.html',
			js: 'dev/js/**/*.js',
			js: 'dev/mobile/js/**/*.js',
			style: 'dev/sass/**/*.scss',
			style: 'dev/mobile/sass/**/*.scss',
			img: 'dev/mobile/img/**/*.*',
			fonts: 'dev/fonts/**/*.*'
		},
		clean: './prod'
	},
	desktop: {
		build: {
			html: 'prod/desktop/',
			js: 'prod/desktop/static/js/',
			css: 'prod/desktop/static/css/',
			img: 'prod/desktop/static/img/',
			fonts: 'prod/desktop/static/fonts/'
		},
		src: {
			html: 'dev/desktop/*.html',
			js: 'dev/js/desktop.js',
			style: 'dev/sass/desktop.scss',
			img: 'dev/desktop/img/**/*.*',
			fonts: 'dev/fonts/**/*.*'
		},
		watch: {
			html: 'dev/desktop/**/*.html',
			js: 'dev/js/**/*.js',
			js: 'dev/desktop/js/**/*.js',
			style: 'dev/sass/**/*.scss',
			style: 'dev/desktop/**/*.scss',
			img: 'dev/desktop/img/**/*.*',
			fonts: 'dev/fonts/**/*.*'
		},
		clean: './prod'
	}
};

var config = {
	server: {
		baseDir: "./prod"
	},
	tunnel: true,
	host: 'localhost',
	port: 8000,
	logPrefix: "Frontend_Devil"
};

gulp.task('webserver', function () {
	browserSync(config);
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
	for(var item in path) {
		console.log(path[item].src.html, path[item].build.html);
		gulp.src(path[item].src.html) 
			.pipe(rigger())
			.pipe(gulp.dest(path[item].build.html))
			.pipe(reload({stream: true}));
	}
});

gulp.task('js:build', function () {
	for(var item in path) {
		console.log(path[item].src.js, path[item].build.js);
		gulp.src(path[item].src.js)
			.pipe(rigger()) 
			.pipe(sourcemaps.init()) 
			.pipe(uglify()) 
			.pipe(sourcemaps.write()) 
			.pipe(gulp.dest(path[item].build.js))
			.pipe(reload({stream: true}));
	}
});

gulp.task('style:build', function () {
	for(var item in path) {
		console.log(path[item].src.style, path[item].build.css);
		gulp.src(path[item].src.style) 
			.pipe(sourcemaps.init())
			.pipe(sass({
				includePaths: ['src/style/'],
				outputStyle: 'compressed',
				sourceMap: true,
				errLogToConsole: true
			}))
			.pipe(prefixer())
			.pipe(cssmin())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(path[item].build.css))
			.pipe(reload({stream: true}));
	}
});

gulp.task('image:build', function () {
	for(var item in path) {
		console.log(path[item].src.img, path[item].build.img);
		gulp.src(path[item].src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path[item].build.img))
		.pipe(reload({stream: true}));
	}
});

gulp.task('fonts:build', function() {
	for(var item in path) {
		console.log(path[item].src.fonts, path[item].build.fonts);
		gulp.src(path[item].src.fonts)
			.pipe(gulp.dest(path[item].build.fonts));
	}
});

gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'fonts:build',
	'image:build'
]);

gulp.task('watch', function(){
	watch([path.mobile.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.desktop.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.mobile.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.desktop.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.mobile.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.desktop.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.mobile.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.desktop.watch.img], function(event, cb) {
		gulp.start('image:build');
	});
	watch([path.mobile.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
	watch([path.desktop.watch.fonts], function(event, cb) {
		gulp.start('fonts:build');
	});
});

gulp.task('default', ['build', 'webserver', 'watch']);