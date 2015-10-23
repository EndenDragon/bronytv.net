var btvStreamApp = btvApp("btvStreamApp", ["ngAnimate"]);

btvStreamApp.animation('.playlist-item', function() {
  return {
    enter : function(element, done) {
      element.css('opacity',0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },
    leave : function(element, done) {
      element.css('opacity', 1);
      jQuery(element).animate({
        opacity: 0
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },
    move : function(element, done) {
      element.css('opacity', 0);
      jQuery(element).animate({
        opacity: 1
      }, done);

      // optional onDone or onCancel callback
      // function to handle any post-animation
      // cleanup operations
      return function(isCancelled) {
        if(isCancelled) {
          jQuery(element).stop();
        }
      }
    },

    // you can also capture these animation events
    addClass : function(element, className, done) {},
    removeClass : function(element, className, done) {}
  }
});

btvStreamApp.controller("StreamCtrl", function($scope, $http, $interval) {
    $scope.properties = {stream_url: ''};
    $scope.chat_url = "https://kiwiirc.com/client?settings=3eda7e82f0210b259be287b5bfa1a89d";
    $scope.chatShown = true;
    $scope.altStream = false;
    $scope.showPlaylist = false;

    $scope.updateValues = function() {
        $http.get("/api/properties").success(function(data) {
            $scope.properties = data["properties"];
            console.log("Now playing: " + $scope.properties.now_streaming);
        });

        if ($scope.showPlaylist) {
            $http.get("/api/playlist").success(function (data) {
                $scope.playlist = data["playlist"];
            });
        } else {
            $scope.playlist = [];
        }
    };

    $scope.init = function() {
        $scope.updateValues();

        $interval(function () {
            $scope.updateValues();
        }, 5000);
    };

    $scope.toggleChat = function() {
        $scope.chatShown = !$scope.chatShown;
    };

    $scope.reloadStream = function() {
        var $frame = $("#stream-frame");
        $frame.attr("src", $frame.attr("src"));
    };

    $scope.popoutChat = function() {
        window.open($scope.chat_url, 'Chat', 'width=800,height=600');
    };

    $scope.swapStream = function() {
        $scope.altStream = !$scope.altStream;
    };
});
