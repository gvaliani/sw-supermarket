var gulp 				= require('gulp');
var browserSync = require('browser-sync');
var $ 					= require('gulp-load-plugins')({lazy: false});
var fs 					= require('fs');
// Systemjs
var Builder = require('systemjs-builder');
var builder = new Builder();

var config = {};
config.path = {
	source: 'app'
};

console.log('Plugins: ', $);

// Static server
gulp.task('serve', function() {

  browserSync.init({
    server: {
      baseDir: "./"
    },
    middleware: require( './api/router' )
  });

});
