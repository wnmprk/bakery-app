var app = angular.module('BakeryApp', []);

app.controller('MainController', function ($scope, $http) {
	// get data from json file
	$http.get('products-data.json')
	.then(function(res){
		$scope.goodies = res.data.treats;                
	});

	// instantiate a cart
	$scope.cart = {};
	
	// cart purchase total starts a 0
	$scope.purchaseTotal = 0;
	
	// add item to cart function
	$scope.addToCart = function (goodie) {
		// if unique item is added to cart for the first time
		if (!$scope.cart[goodie.id]) {
			$scope.cart[goodie.id] = goodie;
			$scope.cart[goodie.id].quantity = 1;
			$scope.cart[goodie.id].totalPrice = $scope.cart[goodie.id].price; 
			$scope.purchaseTotal += $scope.cart[goodie.id].totalPrice;
		}
		// if item has been added to the cart before
		else {
			// always increment item when you add to cart
			var current = $scope.cart[goodie.id];
			current.quantity++;
			// if goodie has bulk discount and is divisible by bulkPricing amount
			if (current.bulkPricing !== null && current.quantity%current.bulkPricing.amount === 0) {
				// calculate bulk pricing for goodies
				var bulkPrice = (current.quantity/current.bulkPricing.amount)*current.bulkPricing.totalPrice;
				var discount = current.totalPrice - bulkPrice
				// price of current goody is reassigned with bulk price
				current.totalPrice = bulkPrice;
				// minus discounted amount from total bill
				$scope.purchaseTotal -= discount;
			}
			// else goodie does not have bulk discount
			else {
				current.totalPrice += current.price;
				$scope.purchaseTotal += current.price;
			}
		}
	}
	
	// promo code
	$scope.enterPromo = function () {
		var promoCode = document.getElementsByTagName("input")[0].value;
		var validCodes = {
			"COOKIE MONSTER": $scope.cart[3],
			"LIME MONSTER": $scope.cart[2]
		};
		// promo code must match and cookies must be in the cart to be validated
		if (validCodes[promoCode]) {
			$scope.purchaseTotal -= validCodes[promoCode].totalPrice;
			document.getElementsByClassName('promo-btn')[0].setAttribute('disabled', '');
			swal("YAY!", "YOUR COOKIES ARE FREE!", "success");
		}
		else {
			swal("OOPS...", "THAT'S AN INVALID CODE!", "error");
		}
	}

	// checking out order
	$scope.checkoutOrder = function () {
		// if cart has products, check out order
		if (Object.keys($scope.cart).length) {
			$scope.cart = {};
			$scope.purchaseTotal = 0;
			swal("YAY!", "YOUR GOODIES ARE ON THEIR WAY!", "success");
		}	
		// if cart is empty...
		else {
			swal("UMM...", "YOUR CART IS EMPTY...");
		}
	}

	// empties entire cart
	$scope.clearCart = function () {
		$scope.cart = {};
		$scope.purchaseTotal = 0;
	}

	// clears one unique item in cart
	$scope.clearItem = function (value) {
		$scope.purchaseTotal -= $scope.cart[value.id].totalPrice;
		$scope.cart[value.id].totalPrice = 0;
		$scope.cart[value.id].quantity = 0;
	}
})