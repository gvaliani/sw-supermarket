function BridgeService() {
  let self = this,
    sw_controller = navigator.serviceWorker.controller;

  return Object.assign( self, {
    send: send
  } );

  function send( request ) {
    return new Promise( function( resolve, reject ) {
      let messageChannel = new MessageChannel();

      // Set func to be called from sw.
      messageChannel.port1.onmessage = function( event ) {
        if ( event.data.error ) {
          reject( event.data.error );
        } else {
          resolve( event.data );
        }
      };

      // Send data to sw and func to connect from sw.
      sw_controller.postMessage( {
        method: request.method,
        url: request.url,
        data: request.data
      },
      [ messageChannel.port2 ] );

    } )
  }
}

module.exports = BridgeService;
