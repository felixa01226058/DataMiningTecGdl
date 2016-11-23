var app = angular.module('myApp', ['datatables']);

app.controller('tabla', function($scope, $http)
	{
    	$http.get("http://localhost:3000/api/proyecto")
        	.then(function(response) {
            	$scope.nodo = response.data;
        });


        $scope.testingClick = function(name)
        {
            $scope.vecinos = null;

            $http.get("http://localhost:3000/api/comidas/" + name.id)
        		.then(function(response) {
            		$scope.vecinos = response.data;
        	});

        };
    }
);