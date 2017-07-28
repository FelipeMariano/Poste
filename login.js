var login = angular.module("login", ["ngCookies"]);
var baseUrl = "http://localhost:3000/";

login.directive("loginForm", [
  function(){
    return {
      restrict: "E",
      templateUrl: "directives/login-form.html",
      controller: "LoginFormController",
      controllerAs: "loginForm"
    }
  }
]);

login.service("LoginService", ["$http", function($http){
  this.signin = function(data, success, error){
    $http.post(baseUrl + "authentication/signin", data).then(function(response){
      success(response);
    }, function(err){
      error(err);
    })

  }
}]);

login.controller("LoginFormController", ["$scope", "$window", "$cookies", "$cookieStore", "LoginService", function($scope, $window, $cookies, $cookieStore, LoginService){

  $scope.signin = function(){
    $scope.u = {};
    $scope.u.alert = false;

    var data = {
      user: $scope.user.login,
      password: $scope.user.password
    };

    function error(err){
      $scope.u.alert = true;
      console.error(err);
    }

    LoginService.signin(data, function(login){
      if(!login.data.success){
        error(login.data.message);
        return;
      }
      $cookieStore.put("role", login.data.user.role);
      $cookieStore.put("user", login.data.user.user);
      $cookieStore.put("userId", login.data.user._id);
      $window.location.href = "/";
    }, function(err){
      console.log(err);
    });
  }
}]);
