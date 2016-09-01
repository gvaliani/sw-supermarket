var gulp      = require( 'gulp' ),
  browserSync = require( 'browser-sync' ),
  webpack     = require( 'webpack-stream' ),
  runSequence = require( 'run-sequence' ),
  clean       = require( 'clean' ),
  config      = {};

config.path = {
  source: 'app/',
  server: './dist/api/router',
  output: 'dist/',
  output_images: 'dist/images/',
  output_fonts: 'dist/fonts/',
  output_vendors: 'dist/vendors/',
  output_styles: 'dist/styles/'
};

// Static server
gulp.task( 'browser-sync', function() {
  browserSync.init( {
    server: {
      baseDir: 'dist/'
    },
    open: false,
    middleware: require ( config.path.server )
  } );
} );

// Delete everything in /dist
gulp.task('clean-dist', function () {
  // return gulp.src( 'dist/' )
  //   .pipe( clean() );
});

// Just moving things
gulp.task( 'move', function() {
  gulp.src( [ './api/**/' ] )
  .pipe( gulp.dest( config.path.output + 'api/' ) );

  gulp.src( [ 'index.html', 'manifest.json' ] )
    .pipe( gulp.dest( config.path.output ) );

  gulp.src( './app/images/**/' )
    .pipe( gulp.dest( config.path.output_images ) );

  gulp.src( './app/fonts/**/' )
    .pipe( gulp.dest( config.path.output_fonts ) );

  gulp.src( './app/styles/**/' )
    .pipe( gulp.dest( config.path.output_styles ) );

  gulp.src( [ 'sw.js', 'app/sw-init.js', 'app/sw-interceptor.js' ] )
    .pipe( gulp.dest( config.path.output ) );

  return gulp.src( './app/vendors/**/' )
    .pipe( gulp.dest( config.path.output_vendors ) );
} );

// Create js bundle
gulp.task('bundle', function() {
  return gulp.src('app/app.js')
    .pipe(
      webpack( require( './webpack.config' ) )
    )
    .pipe(gulp.dest(config.path.output));
});

gulp.task( 'serve', function( cb ) {
  runSequence( 'clean-dist', [ 'move' ], 'bundle', 'browser-sync', cb );

  // Watch changes for html.
  gulp.watch( [ 'app/**/*.*', 'sw.js', 'app/sw-*.js', '!app/**/*.js' ], [ 'move', browserSync.reload ] );

  // Watch changes for js.
  gulp.watch( [ 'app/**/*.js', 'app/**/*.html' ], ['bundle', browserSync.reload ] );

  return true;
});
