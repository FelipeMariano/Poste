var comments = angular.module("comments", ["ngCookies"]);
var baseUrl = "http://localhost:3000/";

comments.directive("commentList", [
  function(){
    return {
      restrict: "E",
      scope: {
        id: "="
      },
      templateUrl: "directives/comments-list.html",
      controller: "CommentsController",
      controllerAs: "comments"
    }
  }
]);


comments.directive("galleryPhoto", [
  function(){
    return {
      restrict: "E",
      scope: {
        url: "="
      },
      templateUrl: "directives/gallery-photo.html",
      controller: "PhotoController",
      controllerAs: "photo"
    }
  }
]);

comments.service("CommentsService", ["$http", "$location", function($http, $location){
  var params = $location.search();
  var comments = [];
  this.get = function(success, error){
    return $http.get(baseUrl + "poste/" + params.foto).then(function(response){
      comments = response.data.comentarios;
      success(response.data);
    }, function(err){
      error(err);
    });
  };

  this.post = function(data, success, error){
    $http.post(baseUrl + "poste/" + params.foto + "/comment", data).then(function(response){
      success(response);
    }, function(err){
      error(err);
    });
  }

  this.remove = function(data, success, error){
    $http.post(baseUrl + "poste/" + data.post + "/comment/delete", {idComentario: data.comentario})
      .then(function(response){
        success(response);
        comments = response.data.comentarios;
      }, function(err){
        error(response);
      });
  }
}]);

comments.controller("PhotoController", ["$scope","$cookies", "$cookieStore", "CommentsService", function($scope, $cookies, $cookieStore, CommentsService){
  $scope.currentUser = $cookieStore.get("user");
  $scope.currentUserId = $cookieStore.get("userId");
  CommentsService.get(function(data){
        $scope.photo_url = data.url;
        $scope.photo = data.titulo;
    });
}]);

comments.controller("CommentsController", ["$scope", "$window", "$cookies", "$cookieStore", "CommentsService", function($scope, $window, $cookies, $cookieStore, CommentsService){
  $scope.currentUser = $cookieStore.get("user");
  $scope.currentUserId = $cookieStore.get("userId");

  this.get = function(){
    CommentsService.get(function(data){
        $scope.comments = data.comentarios;
    });
  }


  $scope.remove = function(comment){

    var data = {
      comentario: comment._id,
      post: comment.post
    }

    CommentsService.remove(data, function(success){
      console.log("removido com sucesso!");
      $window.location.reload();
    }, function(err){
      console.error(err);
    })
  }

  this.get();
}]);


////DIRECTIVE PARA FORMULÁRIO DE COMMENT!
comments.directive("commentForm", [
  function(){
    return {
      restrict: "E",
      templateUrl: "directives/comment-form.html",
      controller: "CommentsFormController",
      controllerAs: "commentsForm"
    }
  }
]);

comments.controller("CommentsFormController", ["$scope", "$window", "$cookies", "$cookieStore",  "CommentsService", function($scope, $window, $cookies, $cookieStore, CommentsService){
  $scope.c = {};
  $scope.c.alert = false;

  var userId = $cookieStore.get("userId");
  var currentUser = $cookieStore.get("user");
  $scope.currentUserId = userId;
  $scope.currentUser = currentUser;
  $scope.showCommentForm = userId != undefined && userId != null && userId != "";

  $scope.comment = function(comments){
    var date = new Date();
    var data = {
      autor: currentUser,
      comentario: $scope.c.comment,
      data:  date
    };

    CommentsService.post(data, function(response){
      $scope.commentsForm.$setPristine();
      $scope.c =   {};
      $window.location.reload();
    }, function(err){
      console.log(err);
    });
  };

  $scope.toggleCommentForm = function(){
    $scope.commentForm.hide = !$scope.commentForm.hide;
  }
}]);
