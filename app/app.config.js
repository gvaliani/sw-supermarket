(function(){
	'use strict'

	var app = angular.module('sw');

	app.config(router);

	router.$inject = ['$stateProvider', '$urlRouterProvider']
	function router($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/");
	  //
	  // Now set up the states
	  $stateProvider
	    .state('home', {
	      url: "/",
	      templateUrl: 'app/routes/home/home.html'
	    })
	    .state('demo1', {
	      url: "/demo1",
	      templateUrl: 'app/routes/demo1/demo1.html'
	    })
	    .state('demo2', {
	      url: "/demo2",
	      templateUrl: 'app/routes/demo2/demo2.html'
	    });
	}
})()
