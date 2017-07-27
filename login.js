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
    //fake
    console.log(data);
    if(!data || data.login != "felipe" || data.password != "123")
    error();
    else
      //TODO
      success({
        status: "success",
        user: "Felipe Mariano",
        user_id: "123"
      });
  }
}]);

login.controller("LoginFormController", ["$scope", "$window", "$cookies", "$cookieStore", "LoginService", function($scope, $window, $cookies, $cookieStore, LoginService){

  $scope.signin = function(){
    $scope.u = {};
    $scope.u.alert = false;

    var data = {
      login: $scope.user.login,
      password: $scope.user.password
    };

    LoginService.signin(data, function(login){
      $cookieStore.put("user", login.user);
      $cookieStore.put("userId", login.user_id);
      $window.location.href = "/";
    }, function(err){
      $scope.user.alert = true;
      console.error("erro ao realizar login!");
    });
  }
}]);
