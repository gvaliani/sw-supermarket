var cache_name = 'v1';

self.addEventListener( 'install', function( event ) {
	  console.log( 'Install' );

  var config = {
      path: {
        app: '/app/',
        vendors: '/app/vendors/',
        fonts: '/app/fonts/',
        styles: '/app/styles/'
      }
    },
    file_to_cache = [
      // VENDORS
      config.path.vendors + 'jquery.min.js',
      config.path.vendors + 'angular.min.js',
      config.path.vendors + 'angular-ui-router.min.js',
      config.path.vendors + 'materialize.min.js',
      config.path.vendors + 'angular-materialize.min.js',

      // FONTS
      config.path.fonts + 'roboto/Roboto-Light.ttf',
      config.path.fonts + 'roboto/Roboto-Light.woff',
      config.path.fonts + 'roboto/Roboto-Light.woff2',
      config.path.fonts + 'roboto/Roboto-Medium.ttf',
      config.path.fonts + 'roboto/Roboto-Medium.woff',
      config.path.fonts + 'roboto/Roboto-Medium.woff2',
      config.path.fonts + 'roboto/Roboto-Regular.ttf',
      config.path.fonts + 'roboto/Roboto-Regular.woff',
      config.path.fonts + 'roboto/Roboto-Regular.woff2',
      config.path.fonts + 'fontawesome/fontAwesome.otf?v=4.6.3',
      config.path.fonts + 'fontawesome/fontawesome-webfont.eot?v=4.6.3',
      config.path.fonts + 'fontawesome/fontawesome-webfont.svg?v=4.6.3',
      config.path.fonts + 'fontawesome/fontawesome-webfont.ttf?v=4.6.3',
      config.path.fonts + 'fontawesome/fontawesome-webfont.woff?v=4.6.3',
      config.path.fonts + 'fontawesome/fontawesome-webfont.woff2?v=4.6.3',

      // Index.html
      '/',

      // STYLES
      config.path.styles + 'styles.css',
      config.path.styles + 'font-awesome.css',
      config.path.styles + 'materialize.min.css',

      // APP
      config.path.app + 'app.module.js',
      config.path.app + 'app.config.js',
      config.path.app + 'routes/home/home.html',
      config.path.app + 'routes/home/home.js',
      config.path.app + 'routes/bought/bought.html',
      config.path.app + 'routes/bought/bought.js',
      config.path.app + 'services/productService.js'
    ];

  event.waitUntil(
		caches.open( cache_name )
		.then( function( cache ) {
			  console.log( 'abrio cache' );
			  return cache.addAll( file_to_cache );
		} )
		.then( function( cache ) {
			  self.skipWaiting();
		} )
		.catch( function( err ) {
			  console.log( 'no abrio', err );
		} )
		);
} );

self.addEventListener( 'activate', event => {
	clients.claim();
	// event.waitUntil(
	// 	caches.keys().then(cacheNames => {
	// 		return Promise.all(
	// 			cacheNames
	// 			.filter(n => caches.indexOf(n) === -1)
	// 			.map(name => caches.delete(name))
	// 			);
	// 	})
	// 	);
} );

self.addEventListener( 'fetch', function interceptGetRequest( event ) {
  // Intercept request just for GET methods
  if ( event.request.method != 'GET' ) {
    return;
  }

  event.respondWith(
		caches
      .match( event.request )
      .then( function matchHandler( response ) {
        return response || fetch( event.request ).then(
          function fetchSuccessful( response ) {
            return caches.open( cache_name ).then(
              function openCacheSuccessful( cache ) {
                cache.put( event.request, response.clone() );
                return response;
              },
              function openCacheFailure( e ) {
                console.log( 'Open cache error: ', e );
              }
            );
          },
          function fetchFailure( e ) {
            console.log( 'Fetch error: ', e );
          }
        );
      } )
		);
} );
