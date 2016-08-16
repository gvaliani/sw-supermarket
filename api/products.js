let products = [];

function ProductsController() {

  return {
    get: get,
    post: post,
    put: put,
    delete: del
  }

  function get( req, res, next ) {
    res.writeHead( 200, { 'Content-Type': 'application/json' } );
    res.end( JSON.stringify( products ) );
  }

  function post( req, res, next ) {
    let product = req.body;

    product.id = products.length + 1;

    products.push( product );

    res.writeHead( 200, 'Ok' );
    res.end( JSON.stringify( product ) );
  }

  function put( req, res, next ) {
    let product = req.body;

    products[ product.id - 1 ] = product;

    res.writeHead( 200, 'Ok' );
    res.end( JSON.stringify( product ) );
  }

  function del( req, res, next ) {
    products = [ ];

    res.writeHead( 200, 'Ok' );
    res.end();
  }
}

module.exports = ProductsController;
