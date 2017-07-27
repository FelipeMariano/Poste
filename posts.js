var posts = angular.module("posts", []);
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

posts.service("PostsService", ["$http", function($http){
  this.get = function(callback){
    return $http.get(baseUrl + "poste/");
  }
}]);

posts.controller("PostsController", ["$scope","PostsService", function($scope, PostsService){
  PostsService.get().then((posts) => {
    console.log(posts);
    $scope.posts = posts.data;
  });
}]);
