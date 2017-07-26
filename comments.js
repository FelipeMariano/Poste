var comments = angular.module("comments", []);

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

comments.service("CommentsService", ["$http", function($http){
  var fake = [
    {
      autor: "nozes",
      conteudo: "achei justo",
      data: "11/07/2017"
    },
    {
      autor: "nozes 2",
      conteudo: "achei justo",
      data: "11/07/2017"
    }
  ];

  this.get = function(callback){
    callback(fake);
  };

  this.post = function(data, callback){
    //TODO
    fake.push(data);
    callback(data);
  }

  this.remove = function(data, callback){
    //TODO
    fake.remove(data);
    callback(data);
  }
}]);

comments.controller("CommentsController", ["$scope", "CommentsService", function($scope, CommentsService){
  CommentsService.get(function(response){
    console.log(response);
    $scope.comments = response;
  });
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

comments.controller("CommentsFormController", ["$scope", "CommentsService", function($scope, CommentsService){
  $scope.c = {};
  $scope.c.alert = false;

  $scope.comment = function(comments){
    var date = new Date();

    var data = {
      autor: $scope.c.autor,
      comment: $scope.c.comment,
      comentarios: 0
    };

    CommentsService.post(data, function(response){
      console.log($scope.commentsForm);
      $scope.commentsForm.$setPristine();
      $scope.c = {};
    });
  };

  $scope.toggleCommentForm = function(){
    $scope.commentForm.hide = !$scope.commentForm.hide;
  }
}]);
