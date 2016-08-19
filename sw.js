importScripts('./sw-interceptor.js');

function isApiCall( event ) {
  return event.request.url.indexOf('/api/') > -1
}

var cache_name = 'v1';

self.addEventListener( 'install', function( event ) {
	  console.log( 'Install' );

  var config = {
      path: {
        app: './',
        vendors: 'vendors/',
        fonts: 'fonts/',
        styles: 'styles/'
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
      config.path.app + 'app.bundle.js'
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
  let isApiCall = self.isApiCall( event );

  // Cache every GET call but api call
  if ( !isApiCall && event.request.method == 'GET' ) {
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
  }

  if ( isApiCall ) {
    // For POST, PUT, DELETE
    event.respondWith(
      fetch( event.request )
        .then(
          function fetchSuccess( response ) {
            return response;
          }
        )
        .catch( function fetchFailure( e ) {
          self.registration.sync.register( 'myFirstSync' );
        }
      )
    )
  }

} );

self.addEventListener( 'message', function messageHandler( event ) {
  console.log( 'Message event: ', event );
} );

self.addEventListener('sync', function(event) {
  console.log('Sync event!');
  if ( event.tag == 'myFirstSync' ) {
    event.waitUntil(
      fetch( '/api/products/', {
        method: 'POST',
        body: '{"name": "a", "inCart": false}',
        credentials: 'include'
      } )
    );
  }
});

// self.addEventListener( 'push', function( event ) {
//   event.waitUntil(
//     self.registration.showNotification( 'ServiceWorker Cookbook', {
//       body: 'Alea iacta est',
//     } )
//   );
// } );

// var notification = new Notification('Notification title', {
//       icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
//       body: "Hey there! You've been notified!",
//     });

//     notification.onclick = function () {
//       window.open("http://stackoverflow.com/a/13328397/1269037");
//     };
