router.$inject = [ '$stateProvider', '$urlRouterProvider' ];
function router( $stateProvider, $urlRouterProvider ) {

  $urlRouterProvider.otherwise( '/' );

  // Now set up the states
  $stateProvider
  .state( 'home', {
    url: '/',
    template: require( './routes/home/home.html' ),
    controller: 'homeCtrl',
    controllerAs: 'home'
  } );
}

module.exports = router
