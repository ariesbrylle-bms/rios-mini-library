var app = angular.module("myApp", ["ngRoute", "ngSanitize", "ui-notification", "datatables", "ngCookies"])
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

// set value of headers for http request
app.factory('httpRequestInterceptor', function ($cookies) {
  return {
    request: function (config) {
      config.headers['Ffuf-library-service'] = $cookies.get('api_service');
      config.headers['X-api-key'] = $cookies.get('api_auth_key');
      config.headers['Authorization'] = $cookies.get('token');
      config.headers['User-id'] = $cookies.get('userid');
      config.headers['User-name'] = $cookies.get('username');
      config.headers['Accept'] = 'application/json;odata=verbose';

      return config;
    }
  };
});

// include headers in all http request
app.config(function($httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
});