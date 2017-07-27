var posts = angular.module("posts", ["ngCookies"]);
var baseUrl = "http://localhost:3000/";

posts.directive("postList", [
  function(){
    return {
      restrict: "E",
      scope: {
        url: "="
      },
      templateUrl: "directives/post-list.html",
      controller: "PostsController",
      controllerAs: "posts"
    }
  }
]);


posts.directive("postForm", [
  function(){
    return {
      restrict: "E",
      templateUrl: "directives/post-form.html",
      controller: "PostFormController",
      controllerAs: "postForm"
    }
  }
]);


posts.service("PostsService", ["$http", function($http){

  var posts = []
  this.get = function(success, error){
    $http.get(baseUrl + "poste/").then(function(response){
      posts = response.data;
      success(posts);
    }, function(err){
      error(err);
    });
  }

  this.post = function(data, success, error){

    $http.post(baseUrl + "poste/new", data).then(function(response){
      posts.unshift(response.data);
      success(response);
    }, function(err){
      error(err);
    });
  }
}]);

posts.controller("PostsController", ["$scope","PostsService", function($scope, PostsService){
  PostsService.get(function(posts){
    $scope.posts = posts;
  });
}]);


posts.controller("PostFormController", ["$scope", "$cookies", "$cookieStore", "PostsService", function($scope, $cookies, $cookieStore, PostsService){
  $scope.p = {};
  $scope.p.alert = false;

  $cookieStore.put("user", "Felipe");

  var userId = $cookieStore.get("userId");
  $scope.currentUserId = userId;
  $scope.showPostForm = userId != undefined && userId != null && userId != "";
  $scope.showLogin = !$scope.showPostForm;

  $scope.post = function(post){
    var date = new Date();

    var data = {
      url: $scope.p.url,
      titulo: $scope.p.titulo,
      data:  date
    };

    PostsService.post(data, function(response){
      $scope.postForm.$setPristine();
      $scope.p = {};
    }, function(err){
      console.log(err);
    });
  };

}]);
