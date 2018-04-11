// navigation bar controller
app.controller("navBarController", function($scope, $http, $location, $cookies){

    // check if user has logged in
    if ($cookies.get('token') == null || $cookies.get('userid') == null || $cookies.get('username') == null){
       window.location = './login.html';
    }

    $scope.username = $cookies.get('username');

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
});

// Change password controller
app.controller("change_password", function($scope, $http, $location, $cookies, Notification){
  // include app-validate.js
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = "./assets/js/app-validate.js";
  document.body.appendChild(script);

  $scope.pass = {};
  $scope.submitForm = function(e){
    // check if password match 
    if ($('#n_password').val() != $('#c_password').val()){
      Notification({message: 'Password does not match.', title: 'Warning!'}, 'warning');
      $('#n_password').val('');
      $('#c_password').val('');
      $('#n_password').focus();
      return false;
    }

    if ($('.form-horizontal').valid()){
        $http({
          method: 'POST',
          url: API_URL + "login/change_password",
          dataType : 'json',
          data : $scope.pass
        }).then(function successCallback(response) {
          Notification({message: response.data.message}, 'success');
          $scope.resetForm();
          $scope.loadTable();
        }, function errorCallback(response) {
          Notification({message: response.data.message, title: 'Error!'}, 'error');
        });
      
    }
  };
});

// dashboard controller
app.controller("dashboard", function($scope, $http, $location){
  $scope.dashboard = {};

    $scope.loadDashboard = function(){
      $http({
            method: 'GET',
            url: API_URL + "book/get_dashboard",
            dataType : 'json',
          }).then(function successCallback(response) {
             $scope.dashboard.cnt_book = response.data.dashboard[0].cnt;
             $scope.dashboard.cnt_borrowed = response.data.dashboard[1].cnt;
             $scope.dashboard.cnt_returned = response.data.dashboard[2].cnt;
          }, function errorCallback(response) {
          });
    }

    $scope.loadDashboard();
});

// book controller
app.controller("book-information", function($scope, $http, $location, Notification, DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){
  // include app-validate.js
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = "./assets/js/app-validate.js";
  document.body.appendChild(script);

  // initialization
	$scope.vm = {};
  $scope.vm.dtInstance = {};   
  $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
       .withOption('paging', true)
       .withOption('searching', true)
       .withOption('info', true);
  $scope.book = {
    'book_title' : '',
    'book_author' : '',
    'book_genre' : '',
    'book_section' : '',
    'book_id' : ''
  };
  $scope.book_data = {};

  // function to clear form
  $scope.resetForm = function(){
     $scope.book.book_title = '';
     $scope.book.book_author = '';
     $scope.book.book_genre = '';
     $scope.book.book_section = '';
     $scope.book.book_id = '';
    $('#reset').trigger('click');
    $(".tagsinput").tagsinput('removeAll');
    $('#book_section').val('');
    $('#book_id').val('');
    $('#book_section').select2({setVal : ''});
  }


  // function to load data to the table
  $scope.loadTable = function(){
    $http({
          method: 'GET',
          url: API_URL + "book/get_book?id=",
          dataType : 'json',
        }).then(function successCallback(response) {
           $scope.book_data = response.data.book_data;
        }, function errorCallback(response) {
        });
  }

  $scope.loadTable();


  /* 
   * function to delete book
   * @param id (integer)
  */
  $scope.delete_book = function(id = 0){
    $scope.resetForm();
    var con = confirm('Are you sure you want to delete this book?');

    if (!con || id == 0)
      return false;

    $http({
          method: 'PUT',
          url: API_URL + "book/delete_book",
          dataType : 'json',
          data : {
            book_id : id
          }
        }).then(function successCallback(response) {
          Notification({message: response.data.message}, 'success');
          $scope.loadTable();
        }, function errorCallback(response) {
          Notification({message: response.data.message, title: 'Error!'}, 'error');
    });
  }


  /* 
   * function to get book details
   * @param id (integer)
  */
  $scope.edit_book = function(id = 0){
    $scope.resetForm();
    $http({
          method: 'GET',
          url: API_URL + "book/get_book?id="+id,
          dataType : 'json',
        }).then(function successCallback(response) {
           $scope.book.book_title = response.data.book_data[0].title;
           $scope.book.book_author = response.data.book_data[0].author;
           $scope.book.book_genre = response.data.book_data[0].genre;
           $scope.book.book_section = response.data.book_data[0].section;
           $scope.book.book_id = response.data.book_data[0].id;
         

           var myarray = response.data.book_data[0].author.split(',');
           for(var i = 0; i < myarray.length; i++)
           {
               if (myarray[i] != 0)
                 $('#book_author').tagsinput('add', myarray[i]);
           }

           var myarray = response.data.book_data[0].genre.split(',');
           for(var i = 0; i < myarray.length; i++)
           {
               if (myarray[i] != 0)
                 $('#book_genre').tagsinput('add', myarray[i]);
           }

           $('#book_section').val(response.data.book_data[0].section);
           $('#book_section').select2({setVal : response.data.book_data[0].section});
        }, function errorCallback(response) {

        });
  }


  /* 
   * function to submit form
   * add and edit book details
  */
  $scope.submitForm = function(e){
    if ($('.form-horizontal').valid()){
      if ($scope.book.book_id == ''){
        // add book details
        $http({
          method: 'POST',
          url: API_URL + "book/add_book",
          dataType : 'json',
          data : $scope.book
        }).then(function successCallback(response) {
          Notification({message: response.data.message}, 'success');
          $scope.resetForm();
          $scope.loadTable();
        }, function errorCallback(response) {
          Notification({message: response.data.message, title: 'Error!'}, 'error');
        });
      }else{
        // update book details
        $http({
          method: 'PUT',
          url: API_URL + "book/edit_book",
          dataType : 'json',
          data : $scope.book
        }).then(function successCallback(response) {
          Notification({message: response.data.message}, 'success');
          $scope.resetForm();
          $scope.loadTable();
        }, function errorCallback(response) {
          Notification({message: response.data.message, title: 'Error!'}, 'error');
        });
      }
    }
  };
});

// borrow book controller
app.controller("borrow-book", function($scope, $http, $location, Notification, DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){
  // initialization
  $scope.vm = {};
  $scope.vm.dtInstance = {};   
  $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
       .withOption('paging', true)
       .withOption('searching', true)
       .withOption('info', true);
  $scope.book_data = {};
  $scope.borrower = '';

  // function to load data to the table
  $scope.loadTable = function(){
    $http({
          method: 'GET',
          url: API_URL + "book/get_available_book",
          dataType : 'json',
        }).then(function successCallback(response) {
           $scope.book_data = response.data.book_data;
        }, function errorCallback(response) {
        });
  }

  $scope.loadTable();


  /* 
   * function to delete book 
   * @param id (integer)
  */
  $scope.borrow_book = function(id = 0){
    if ($('#book_borrower').val() == ''){
        Notification({message: 'Please enter borrower\'s name.' , title: 'Warning!'}, 'warning');
        $('#book_borrower').focus();
        return false;
    }

    $http({
          method: 'POST',
          url: API_URL + "book/borrow_book",
          dataType : 'json',
          data : {
            book_id : id,
            borrower : $scope.borrower
          }
        }).then(function successCallback(response) {
          Notification({message: response.data.message}, 'success');
          $scope.loadTable();
        }, function errorCallback(response) {
          Notification({message: response.data.message, title: 'Error!'}, 'error');
    });
  }
});

// return book controller
app.controller("return-book", function($scope, $http, $location, Notification, DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder){
	$scope.vm = {};
  $scope.vm.dtInstance = {};   
  $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
       .withOption('paging', true)
       .withOption('searching', true)
       .withOption('info', true);

  $scope.book_data = {};
  $scope.book_data_history = {};

  // function to load data to the table
  $scope.loadTable = function(){
    $http({
          method: 'GET',
          url: API_URL + "book/get_borrowed_book",
          dataType : 'json',
        }).then(function successCallback(response) {
           $scope.book_data = response.data.book_data;
        }, function errorCallback(response) {
        });
  }

  // function to load data to the table
  $scope.loadTable_history = function(){
    $http({
          method: 'GET',
          url: API_URL + "book/get_borrowed_history",
          dataType : 'json',
        }).then(function successCallback(response) {
           $scope.book_data_history = response.data.book_data;
        }, function errorCallback(response) {
        });
  }

  $scope.loadTable();
  $scope.loadTable_history();


  /* 
   * function to return book 
   * @param id (integer)
   * @param borrow_id (integer)
  */
  $scope.return_book = function(id = 0, borrow_id){
    $http({
          method: 'POST',
          url: API_URL + "book/return_book",
          dataType : 'json',
          data : {
            book_id : id,
            borrow_id : borrow_id
          }
        }).then(function successCallback(response) {
          Notification({message: response.data.message}, 'success');
          $scope.loadTable();
        }, function errorCallback(response) {
          Notification({message: response.data.message, title: 'Error!'}, 'error');
    });
  }

});
