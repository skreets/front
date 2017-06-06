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
			html:  'prod/mobile',
			js: 	 'prod/static/js',
			jsp:   'prod/static/js/mobile',
			css:   'prod/static/css',
			img:   'prod/static/img',
			fonts: 'prod/static/fonts',
			lib:   'prod/static/js/lib',
			ajax:  'prod/data/ajax'
		},
		src: {
			html:  'dev/mobile/*.html',
			js:   'dev/js/jquery_mobile.js',
			jsp:   'dev/js/mobile/**/*.*',
			style: 'dev/sass/mobile.scss',
			img:   'dev/img/**/*.*',
			fonts: 'dev/fonts/**/*.*',
			lib:   'dev/js/lib/**/*.*',
			ajax:  'dev/data/ajax/**/*.*'
		},
		watch: {
			html:  'dev/mobile/**/*.html',
			js:   'dev/js/jquery_mobile.js',
			jsp:   'dev/js/mobile/**/*.*',
			style: 'dev/**/*.scss',
			img:   'dev/img/**/*.*',
			fonts: 'dev/fonts/**/*.*',
			lib:   'dev/js/lib/**/*.*',
			ajax:  'dev/data/ajax/**/*.*'
		},
		clean: './prod'
	},
	desktop: {
		build: {
			html:  'prod/desktop',
			js: 	 'prod/static/js',
			jsp:   'prod/static/js/desktop',
			css:   'prod/static/css',
			img:   'prod/static/img',
			fonts: 'prod/static/fonts',
			lib:   'prod/static/js/lib',
			ajax:  'prod/data/ajax/'
		},
		src: {
			html:  'dev/desktop/*.html',
			js:   'dev/js/jquery_desktop.js',
			jsp:   'dev/js/desktop/**/*.*',
			style: 'dev/sass/desktop.scss',
			img:   'dev/img/**/*.*',
			fonts: 'dev/fonts/**/*.*',
			lib:   'dev/js/lib/**/*.*',
			ajax:  'dev/data/ajax/**/*.*'
		},
		watch: {
			html:  'dev/desktop/**/*.html',
			js:   'dev/js/jquery_desktop.js',
			jsp:   'dev/js/desktop/**/*.*',
			style: 'dev/**/*.scss',
			img:   'dev/img/**/*.*',
			fonts: 'dev/fonts/**/*.*',
			lib:   'dev/js/lib/**/*.*',
			ajax:  'dev/data/ajax/**/*.*'
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

gulp.task('jsp:build', function() {
	for(var item in path) {
		console.log(path[item].src.jsp, path[item].build.jsp);
		gulp.src(path[item].src.jsp)
			.pipe(gulp.dest(path[item].build.jsp));
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

gulp.task('lib:build', function() {
	for(var item in path) {
		console.log(path[item].src.lib, path[item].build.lib);
		gulp.src(path[item].src.lib)
			.pipe(gulp.dest(path[item].build.lib));
	}
});

gulp.task('ajax:build', function() {
	for(var item in path) {
		console.log(path[item].src.ajax, path[item].build.ajax);
		gulp.src(path[item].src.ajax)
			.pipe(gulp.dest(path[item].build.ajax));
	}
});

gulp.task('build', [
	'html:build',
	'js:build',
	'jsp:build',
	'style:build',
	'fonts:build',
	'image:build',
	'lib:build',
	'ajax:build'
]);

gulp.task('watch', function(){
	watch([path.mobile.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.desktop.watch.html], function(event, cb) {
		gulp.start('html:build');
	});
	watch([path.mobile.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.desktop.watch.js], function(event, cb) {
		gulp.start('js:build');
	});
	watch([path.mobile.watch.jsp], function(event, cb) {
		gulp.start('jsp:build');
	});
	watch([path.desktop.watch.jsp], function(event, cb) {
		gulp.start('jsp:build');
	});
	watch([path.mobile.watch.style], function(event, cb) {
		gulp.start('style:build');
	});
	watch([path.desktop.watch.style], function(event, cb) {
		gulp.start('style:build');
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
	watch([path.mobile.watch.lib], function(event, cb) {
		gulp.start('lib:build');
	});
	watch([path.desktop.watch.lib], function(event, cb) {
		gulp.start('lib:build');
	});
	watch([path.mobile.watch.ajax], function(event, cb) {
		gulp.start('ajax:build');
	});
	watch([path.desktop.watch.ajax], function(event, cb) {
		gulp.start('ajax:build');
	});
});

gulp.task('default', ['build', 'webserver', 'watch']);