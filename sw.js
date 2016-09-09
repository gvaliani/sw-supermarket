importScripts( './sw-interceptor.js' );

function isApiCall( event ) {
  return event.request.url.indexOf( '/api/' ) > -1
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
      config.path.app + 'app.bundle.js',

      // DATA
      config.path.app + 'api/products'
    ];

  event.waitUntil(
    save_in_cache( file_to_cache )
      .then( function() {
        self.skipWaiting();
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

          // Use cache data o fetch it.
          return response || fetch( event.request ).then(
            function fetch_successful( response ) {
              return save_in_cache( event.request, response.clone() );
            },
            function fetch_failure( e ) {
              // eslint-disable-next-line no-console
              console.log( 'Error on getting files: ', e );
            }
          );

        } )
      );
  }

  if ( isApiCall && event.request.method == 'GET' ) {

    // event.respondWith(
    //   caches
    //     .match( event.request )
    //     .then( function matchHandler( response ) {
    //       return response;
    //     } )
    //     .catch( function( e ) {
    //       console.log( 'Fallo la busqueda: ', e )
    //     } )
    // )
    console.log( 'Llamada a la api y a GET.' );
    event.respondWith(
      fetch( event.request )
        .then( function response_handler( response ) {
          return response;
        } )
        .catch( function( e ) {
          console.log( 'Catch.' );
          return caches
            .match( event.request )
            .then( function matchHandler( response ) {
              console.log( 'Encontro algo: ', response.clone().json() );
              return response;
            } )
            .catch( function( e ) {
              console.log( 'Fallo la busqueda: ', e )
            } )
        } )
    )
  }

  // API calls for methods POST, PUT and DELETE.
  if ( isApiCall && event.request.method != 'GET' ) {
    // Update the list of products.
    udpate_list();
  }

} );

self.addEventListener( 'message', function message_handler( event ) {
  // Make call through sync event.
  async_request( event.data, event );
} );

function async_request( data, message_event ) {

  function post( event ) {
    if ( event.tag == 'sync_call' ) {

      let request = new Request( data.url, {
        method: data.method,
        body: JSON.stringify( data.data )
      } );

      event.waitUntil(
        fetch( request )
          .then(
            function fetch_success( response ) {
              let res = response.clone();

              // unbind event listener. Otherwise it will generate duplicated calls.
              self.removeEventListener( 'sync', post );

              res.json().then( function( json ) {
                // Update product list
                udpate_list();

                message_event.ports[ 0 ].postMessage( [ json ] );
              } )
            }
          )
      );
    }
  }

  self.addEventListener( 'sync', post );
  self.registration.sync.register( 'sync_call' );
}

function udpate_list() {
  let request = new Request( 'api/products', {
    method: 'GET'
  } );

  fetch( request )
    .then( function fetch_success( response ) {
      save_in_cache( request, response.clone() )
    } )
    .catch( function fetch_error( e ) {
      // eslint-disable-next-line no-console
      console.log( 'Error on fetch data for update the list of products: ', e );
    } )
}

function save_in_cache( url, data ) {
  return caches
    .open( cache_name )
    .then( function open_cache_successfully( cache ) {
      if ( Array.isArray( url ) ) {
        return cache.addAll( url );
      } else {
        return cache.put( url, data );
      }
    } )
    .catch( function cache_error( e ) {
      // eslint-disable-next-line no-console
      console.log( 'Error opening cache or saving data in cache: ', e );
    } );
}

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
