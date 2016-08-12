( function() {
  'use strict';

  var app = angular.module( 'sw' );

  app.config( router );

  router.$inject = [ '$stateProvider', '$urlRouterProvider' ];
  function router( $stateProvider, $urlRouterProvider ) {

    $urlRouterProvider.otherwise( '/' );

    // Now set up the states
    $stateProvider
    .state( 'home', {
      url: '/',
      templateUrl: 'app/routes/home/home.html',
      controller: 'homeCtrl',
      controllerAs: 'home'
    } )
    .state( 'bought', {
      url: '/bought-products',
      templateUrl: 'app/routes/bought/bought.html',
      controller: 'boughtCtrl',
      controllerAs: 'bought'
    } );
  }
} )()
