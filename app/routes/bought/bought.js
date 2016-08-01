app.controller('boughtCtrl', boughtCtrl);

boughtCtrl.$inject = ['$rootScope'];
function boughtCtrl($rootScope){
	var self = this;

	function init(){
		self.bought_product_list = $rootScope.bought_product_list;
		self.total = 0;
		angular.forEach($rootScope.bought_product_list, function(item){			
			console.log(item);
			self.total = self.total + parseInt(item.price);
		});		
	}
	init();
};