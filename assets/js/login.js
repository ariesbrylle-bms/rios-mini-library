var app = angular.module("loginApp", ["ngSanitize", "ui-notification", "ngCookies"])
	.config(function(NotificationProvider){
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });
    });


app.controller("loginController", function($scope, $http, $location, Notification, $cookies) {
	$scope.login = {};
	// $http.defaults.headers.common['Ffuf-library-service'] = api_services;
 //    $http.defaults.headers.common['X-api-key'] = api_key;
    $cookies.remove('token');
	$cookies.remove('userid');
	$cookies.remove('username');
	$cookies.remove('api_service');
	$cookies.remove('api_auth_key');

	$scope.submitForm = function(e){
		$http({
			  method: 'POST',
			  url: API_LOGIN,
			  dataType : 'json',
			  data : $scope.login
			}).then(function successCallback(response) {
				Notification({message: response.data.message, title: 'Please wait...'}, 'success');
				$cookies.put('token', response.data.token);
				$cookies.put('userid', response.data.id);
				$cookies.put('username', response.data.username);
				$cookies.put('api_service', response.data.api_service);
				$cookies.put('api_auth_key', response.data.api_auth_key);
				window.location = './main.html';
			}, function errorCallback(response) {
				Notification({message: response.data.message, title: 'Error!'}, 'error');
			});
    };
});