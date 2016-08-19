let app_instance,
  router = require( './app.config' ),
  homeCtrl = require( './routes/home/home' ),
  productService = require( './services/productService' );

module.exports = function App() {
  return app_instance || angular.module( 'sw', [ 'ui.router', 'ui.materialize' ] )
    .config( router )
    .factory( 'productService', productService )
    .controller( 'homeCtrl', homeCtrl );
}();
