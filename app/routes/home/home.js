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
      inCart: false,
    } );

    productService
      .post( self.product )
      .then( function successPost() {
        refresh_list();
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
  // function add_price_to_product( id, price ) {
  //   console.log("me llamaron!");
  //   for ( var product in $rootScope.product_list ) {
  //     if ( $rootScope.product_list[product].id == id ) {
  //       $rootScope.product_list[product].price = price;
  //       self.product.newPrice = '';
  //       $('#product_'+id).click();
  //       break;
  //     }
  //   }
  //   self.product = '';
  // }

  // function buy_product(product, $index){
  //   $('#product_'+product.id).click();
  //   $rootScope.bought_product_list.push(product);
  //   $rootScope.product_list.splice($index, 1);
  // }

  // function remove_product($index){
  //   $('#product_'+$index).click();
  //   $rootScope.product_list.splice($index, 1);
  // }

  // function init(){
  //   <script type="text/javascript" src="app/routes/bought/bought.js"></script>
  //   self.add_product = add_product;
  //   self.add_price_to_product = add_price_to_product;
  //   self.buy_product = buy_product;
  //   self.remove_product = remove_product;
  //   self.product = '';
  //   self.id = 0;
  //   self.product = {
  //     id:'',
  //     name:'',
  //     price:''
  //   };
  //   console.log($rootScope.product_list);
  //   if($rootScope.product_list === undefined){
  //     $rootScope.product_list = [];
  //   }
  //   if($rootScope.bought_product_list === undefined){
  //     $rootScope.bought_product_list = [];
  //   }
  // }
  // init();
}

module.exports = homeCtrl;
