// Polyfills
;(function () {
  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback /*, initialValue*/) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.reduce called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      var t = Object(this), len = t.length >>> 0, k = 0, value;
      if (arguments.length == 2) {
        value = arguments[1];
      } else {
        while (k < len && !(k in t)) {
          k++; 
        }
        if (k >= len) {
          throw new TypeError('Reduce of empty array with no initial value');
        }
        value = t[k++];
      }
      for (; k < len; k++) {
        if (k in t) {
          value = callback(value, t[k], k, t);
        }
      }
      return value;
    };
  }
}());

// App
;(function () {
  var app = angular.module('spanish_food', ['ngDragDrop']);


  app.controller('MainCtrl', function ($scope, $http, $timeout) {
    $scope.page = 0;

    $http.get("/data/foods.json").then(function (response) {
      $scope.foods = response.data.reduce(function (foods, food) {
        foods[food.name] = food;
        return foods;
      }, {});

      $scope.ready = true;
    });

    $scope.reset = function () {
      window.location.reload();
    };

    $scope.hasPage = function (page) {
      return page <= Object.keys($scope.foods).length;
    };

    $scope.nextPage = function (page) {
      var next = 'undefined' == page ? $scope.page + 1 : page;
      var $page = $(".page").eq(next);

      if ($page.length) {
        $scope.page = next;
        $("#main").animate({scrollTop: $page.offset().top * $scope.page}, 400);
      }
      else {
        $scope.reset();
      }
    };

    var handleLikeDrop = function (bool) {
      return function (evt, obj) {
        var $draggable = $(obj.draggable)
          , food = $draggable.data("food");

        $scope.foods[food].likes = bool;
      }
    }

    $scope.onLikeDrop = handleLikeDrop(true);
    $scope.onDislikeDrop = handleLikeDrop(false);

    $scope.showQuestion = function (food) {
      var v = !$scope.foods[food] || 'undefined' === typeof $scope.foods[food].likes;
      return v;
    }

    $scope.showLiked = function (food) {
      var v = $scope.foods[food] && true === $scope.foods[food].likes;
      return v;
    }

    $scope.showDisliked = function (food) {
      var v = $scope.foods[food] && false === $scope.foods[food].likes;
      return v;
    }
  });

}());
