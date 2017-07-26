var posts = angular.module("posts", []);

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
    callback([
      {
        url: "https://blog.emania.com.br/content/uploads/2015/12/Papel-de-Parede-de-Paisagem.jpg",
        titulo: "Thumb!",
        comentarios: 5
      }
    ]);
  }
}]);

posts.controller("PostsController", ["$scope","PostsService", function($scope, PostsService){
  PostsService.get(function(response){
    console.log(response);
    $scope.posts = response;
  });
}]);
