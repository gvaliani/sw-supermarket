productService.$inject = [ '$http', 'swBridgeService' ];
function productService( $http, swBridgeService ) {
  let self = this;

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

  function post( product ) {
    let req;

    req = {
      method: 'POST',
      url: '/api/products',
      data: product
    };

    return request( req );
  }

  function put( product ) {
    let req;

    req = {
      method: 'PUT',
      url: '/api/products',
      data: product
    };

    return request( req );
  }

  function del() {
    let req;

    req = {
      method: 'DELETE',
      url: '/api/products'
    };

    return request( req );
  }

  // PRIVATE FUNCTIONS

  function request( req ) {

    return $http( req )
    .then( function succesHandler( res ) {
      return res.data;
    } )
    .catch( function failHandler() {

      // Make same call through sw.
      return swBridgeService
        .send( req )
        .then( function handle_success( res ) {
          let product = res.shift();

          return product;
        } )
        .catch( function handle_error() {
          // eslint-disable-next-line no-console
          console.error( 'La llamada desde el sw fallo: ', arguments );
        } );

    } );

  }
}

module.exports = productService
