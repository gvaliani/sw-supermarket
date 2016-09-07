homeCtrl.$inject = [ 'productService' ];
function homeCtrl( productService ) {
  let self = this;

  init();

  return Object.assign( self, {
    products: [],
    add_product: add_product,
    toggle_cart: toggle_cart,
    reset_list: reset_list,
    refresh_sw: refresh_sw
  } );

  function add_product() {
    Object.assign( self.product, {
      tempId: Date.now(),
      inCart: false
    } );

    let temp_product = Object.assign( {}, self.product );
    temp_product.status = 'Pending...';
    self.products.push( temp_product );

    productService
      .post( self.product )
      .then( function successPost( new_product ) {

        self.products.map( function find_product( item, key, arr ) {
          if ( item.tempId == new_product.tempId ) {
            arr[ key ] = new_product;
          }
        } );

      } );

    self.product = '';
  }

  function toggle_cart( product ) {
    product.inCart = !product.inCart;
    productService
      .put( product );
  }

  function reset_list() {
    productService
      .del()
      .then( function handleSuccessDeletion() {
        refresh_list();
      } );
  }

  function refresh_sw() {
    navigator.serviceWorker.ready.then( function handleRegistration( registration ) {

      registration
        .unregister()
        .then( function( boolean ) {
          console.info( 'Unregistration: ', boolean == true );
        } )
        .catch( function() {
          console.info( 'Unregistration failed.' );
        } )

    } );

    caches.keys().then( function( keyList ) {

      return Promise.all( keyList.map( function( key ) {
        caches.delete( key );
        console.info( 'Delete cache:', key );
      } ) );
    } );
  }


  // PRIVATE FUNCTIONS

  function init() {
    refresh_list();
  }

  function refresh_list() {
    productService
      .get()
      .then( function setProductList( res ) {
        self.products = res;
      } );
  }
}

module.exports = homeCtrl;
