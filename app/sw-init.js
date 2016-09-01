if ( 'serviceWorker' in navigator ) {
  navigator.serviceWorker.register( './sw.js', { scope: '/' } )
  .then( function( registration ) {
    // eslint-disable-next-line no-console
    console.log( 'Service Worker has been registered: ', registration );
  } )
  .catch( function( err ) {
    // eslint-disable-next-line no-console
    console.log( 'Service Worker Failed to Register', err );
  } )
}
