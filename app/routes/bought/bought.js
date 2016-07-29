app.controller('boughtCtrl', boughtCtrl);

boughtCtrl.$inject = ['$rootScope'];
function boughtCtrl($rootScope){
	var self = this;

	function init(){
		self.bought_product_list = $rootScope.bought_product_list;
	}
	init();
};