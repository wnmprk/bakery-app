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
			$scope.cart[goodie.id].quantity++;
			// if goodie is brownie
			if (goodie.id === 1 && $scope.cart[goodie.id].quantity%4 === 0) {
				$scope.cart[goodie.id].totalPrice = $scope.cart[goodie.id].quantity/4 * 7;
				$scope.purchaseTotal += 1;
			}
			// if goodie is cookie
			else if (goodie.id === 3 && $scope.cart[goodie.id].quantity%6 === 0) {
				$scope.cart[goodie.id].totalPrice = $scope.cart[goodie.id].quantity;
				$scope.purchaseTotal -= 0.25;
			}
			// if goodie does not have bulk discount
			else {
				$scope.cart[goodie.id].totalPrice += $scope.cart[goodie.id].price;
				$scope.purchaseTotal += $scope.cart[goodie.id].price;
			}
		}
	}
	
	// promo code
	$scope.enterPromo = function () {
		var code = document.getElementsByTagName("input")[0].value;
		var cartItems = document.getElementsByClassName('one-item');
		// promo code must match and cookies must be in the cart to be validated
		if (code === "COOKIE MONSTER" && $scope.cart[3]) {
			$scope.purchaseTotal -= $scope.cart[3].totalPrice;
			swal("YAY!", "YOUR COOKIES ARE FREE!", "success");
		}
		else if (code !== "COOKIE MONSTER"){
			swal("OOPS...", "THAT'S AN INVALID CODE!", "error");
		}
	}

	// checking out order
	$scope.checkoutOrder = function () {
		// if total purchase has a value, check out order
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
		$scope.cart[value.id].quantity = "";

	}
})