app.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$rootScope'];
function homeCtrl($rootScope){
	var self = this;

	function add_product(){
		self.product.id = self.id++;
		console.log(self.product.id);		
		self.product_list.push(self.product);
		self.product = '';
	}
	function add_price_to_product(id, price){
		console.log(id,price);
		for (var product in self.product_list) {
			if (self.product_list[product].id == id){
				console.log(id,price);
				self.product_list[product].price = price;
				self.newPrice = '';
				$('#product_'+id).click();
				break;
			}
		}
		self.product = '';
	}

	function buy_product(product, $index){
		$('#product_'+product.id).click();
		$rootScope.bought_product_list.push(product);
		self.product_list.splice($index, 1); 
	}

	function remove_product($index){
		$('#product_'+$index).click();
		self.product_list.splice($index, 1);     
	}

	function init(){
		console.log("init");
		self.add_product = add_product;
		self.add_price_to_product = add_price_to_product;
		self.buy_product = buy_product;
		self.remove_product = remove_product;
		self.product = '';
		self.product_list = [];
		$rootScope.bought_product_list = [];
		self.id = 0;
		self.product = {
			id:'',
			name:'',
			price:''
		};
	}
	init();
}