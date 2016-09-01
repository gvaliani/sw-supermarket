productService.$inject = [ '$http' ];
function productService( $http ) {
  var self = this;

  return Object.assign( self, {
    get: get,
    post: post,
    put: put,
    del: del
  } );

  function get() {
    return $http( {
      method: 'GET',
      url: '/api/products',
    } ).then( function succesHandler( res ) {
      return res.data;
    } );
  }

  function post( data ) {
    return $http( {
      method: 'POST',
      url: '/api/products',
      data: data
    } )
    .then( function succesHandler( res ) {
      return res.data;
    } )
    .catch( function failHandler( e ) {

      return new Promise( function( resolve, reject ) {
        var messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = function( event ) {
          console.log('Desde el servicio: ', arguments)
          resolve();
          if (event.data.error) {
            // reject(event.data.error);
          } else {
            // resolve(event.data);
          }
        };

        navigator.serviceWorker.controller.postMessage(
          {
            method: 'POST',
            url: '/api/products',
            data: data
          },
          [messageChannel.port2]
        );
      } )

    } );
  }

  function put( data ) {
    return $http( {
      method: 'PUT',
      url: '/api/products',
      data: data
    } ).then( function succesHandler( res ) {
      return res.data;
    } );
  }

  function del() {
    return $http( {
      method: 'DELETE',
      url: '/api/products'
    } );
  }
}

module.exports = productService
