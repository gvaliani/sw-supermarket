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
    let clone_product;

    Object.assign( self.product, {
      tempId: Date.now(),
      inCart: false
    } );

    clone_product = Object.assign( {}, self.product );
    clone_product.status = 'Pending...';
    self.products.push( clone_product );

    productService
      .post( self.product )
      .then( function successPost( new_product ) {

        replace_item( clone_product, new_product );

      } );

    self.product = '';
  }

  function toggle_cart( product ) {
    let clone_product;

    product.inCart = !product.inCart;

    clone_product = Object.assign( {
      status: 'Pending...'
    }, product );

    replace_item( product, clone_product );

    productService
      .put( product )
      .then( function after_saved( saved_product ) {
        replace_item( clone_product, saved_product );
      } );
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

  // function find_item( item_wanted ) {
  //   let result,
  //     item_wanted_id;

  //   item_wanted_id = item_wanted.id || item_wanted.tempId;

  //   result = self.products.filter( function filter_by_id( item ) {
  //     let item_id = item.id || item.tempId;
  //     if ( item_wanted_id === item_id ) {
  //       return true;
  //     }

  //     return false;
  //   } ).shift();

  //   return result;
  // }

  function replace_item( original_item, new_item ) {
    let original_item_id;

    original_item_id = original_item.id || original_item.tempId;

    self.products.map( function find_product( item, key, arr ) {
      let item_id = item.id || item.tempId;

      if ( original_item_id == item_id ) {
        arr[ key ] = new_item;
      }
    } );
  }
}

module.exports = homeCtrl;
