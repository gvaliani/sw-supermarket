require( 'traceur/bin/traceur-runtime' );

let app_instance,
  router = require( './app.config' ),
  homeCtrl = require( './routes/home/home' ),
  swBridgeService = require( './services/sw-bridge-service' ),
  productService = require( './services/product-service' );

module.exports = function App() {
  return app_instance || angular.module( 'sw', [ 'ui.router', 'ui.materialize' ] )
    .config( router )
    .factory( 'productService', productService )
    .factory( 'swBridgeService', swBridgeService )
    .controller( 'homeCtrl', homeCtrl );
}();
