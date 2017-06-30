var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var plumber = require("gulp-plumber");
var rename = require("gulp-rename");
var notify = require('gulp-notify');
var ejs      = require( 'gulp-ejs' );
var webserver = require('gulp-webserver');
var replace = require('gulp-replace');
var htmlbeautify = require('gulp-html-beautify');
var jsonContents = require('./templates/contents.json');
var jsonVideos = require('./templates/videos.json');

//=======================================================

gulp.task("default",['server','sass-compile','ejs-compile'], 
	function() {
		gulp.watch("./common/scss/*.scss",["sass-compile"]);
		gulp.watch("./templates/*.ejs", ['ejs-compile']);
		gulp.watch("./*.html", ['bs-reload']);
		gulp.watch("./common/*.scss", ['bs-reload']);
	});

//=======================================================

gulp.task('sass-compile', function() {
	gulp.src('./common/scss/*.scss')

	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
		cascade: false
	}))
	.pipe(gulp.dest('./common/css/'))
	.pipe(browserSync.reload({stream:true}))
});

// gulp.task('sass-watch', ['sass-compile'], function(){
// 	var watcher = gulp.watch('./common/scss/*.scss', ['sass-compile']);
// 	watcher.on('change', function(event) {
// 	});
// });

gulp.task("server", function() {
	browserSync({
		server: {
			baseDir: "../../"
		}
	});
});

gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./",
			index: "index.html"
		}
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});


gulp.task("ejs-compile", function() {
	gulp.src(
		["./templates/*.ejs",'!' + "./templates/_*.ejs"]
		)
	.pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
	.pipe(ejs({jsonContents: jsonContents,jsonVideos:jsonVideos}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest("./"))
});


var removeHtmlComments = require('gulp-remove-html-comments');
var removeEmptyLines = require('gulp-remove-empty-lines');
var cleanCSS = require('gulp-clean-css');

gulp.task('probuild', function() {
	gulp.src('./index.html')
	.pipe(removeHtmlComments())
	.pipe(removeEmptyLines())
	.pipe(htmlbeautify({
		"indent_size":"2",
		"indent_char":" ",
		"max_preserve_newlines":"1",
		"unformatted":"video,source"
	}))
	.pipe(gulp.dest('./'));

	gulp.src('./common/css/*.css')
	.pipe(cleanCSS())
	.pipe(gulp.dest('./common/css/'));
});








