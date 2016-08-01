app.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$rootScope'];
function homeCtrl($rootScope){
	var self = this;

	function add_product(){
		self.product.id = self.id++;
		$rootScope.product_list.push(self.product);
		self.product = '';
	}
	function add_price_to_product(id, price){
		for (var product in $rootScope.product_list) {
			if ($rootScope.product_list[product].id == id){
				$rootScope.product_list[product].price = price;
				self.product.newPrice = '';
				$('#product_'+id).click();
				break;
			}
		}
		self.product = '';
	}

	function buy_product(product, $index){
		$('#product_'+product.id).click();
		$rootScope.bought_product_list.push(product);
		$rootScope.product_list.splice($index, 1); 
	}

	function remove_product($index){
		$('#product_'+$index).click();
		$rootScope.product_list.splice($index, 1);     
	}

	function init(){
		self.add_product = add_product;
		self.add_price_to_product = add_price_to_product;
		self.buy_product = buy_product;
		self.remove_product = remove_product;
		self.product = '';
		self.id = 0;
		self.product = {
			id:'',
			name:'',
			price:''
		};
		console.log($rootScope.product_list);
		if($rootScope.product_list === undefined){
			$rootScope.product_list = [];
		}
		if($rootScope.bought_product_list === undefined){
			$rootScope.bought_product_list = [];
		}	
	}
	init();
}