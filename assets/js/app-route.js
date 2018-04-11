app.config(function($routeProvider) {
      $routeProvider
      .when("/", {
          templateUrl : "./app/dashboard/dashboard.html",
          controller : "dashboard"
      })

      .when("/book-information", {
          templateUrl : "./app/book/books.html"
      })

      .when("/borrow-book", {
          templateUrl : "./app/borrow_books/borrow.html",
          controller : "borrow-book"
      })

      .when("/return-book", {
          templateUrl : "./app/return_books/return.html",
          controller : "return-book"
      })

      .when("/change_password", {
          templateUrl : "./app/dashboard/change_password.html",
          controller : "change_password"
      });
  });



