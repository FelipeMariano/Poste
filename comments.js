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
    //callback(fake);
  };

  this.post = function(data, success, error){
    $http.post(baseUrl + "poste/" + params.foto + "/comment", data).then(function(response){
      comments.push(data);
      success(response);
    }, function(err){
      error(err);
    });
    //fake.push(data);
    //callback(data);
  }

  this.remove = function(data, callback){
    //TODO
    fake.remove(data);
    callback(data);
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

comments.controller("CommentsController", ["$scope", "$cookies", "$cookieStore", "CommentsService", function($scope, $cookies, $cookieStore, CommentsService){
  $scope.currentUser = $cookieStore.get("user");
  $scope.currentUserId = $cookieStore.get("userId");

  this.get = function(){
    CommentsService.get(function(data){
        $scope.comments = data.comentarios;
    });
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

comments.controller("CommentsFormController", ["$scope", "$cookies", "$cookieStore",  "CommentsService", function($scope, $cookies, $cookieStore, CommentsService){
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
      $scope.c = {};
    }, function(err){
      console.log(err);
    });
  };

  $scope.toggleCommentForm = function(){
    $scope.commentForm.hide = !$scope.commentForm.hide;
  }
}]);
