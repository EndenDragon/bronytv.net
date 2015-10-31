var btvStreamApp = btvApp("btvStreamApp", ["ngAnimate"]);

btvStreamApp.controller("StreamCtrl", function($scope, $http, $interval) {
    $scope.properties = {stream_url: '', now_streaming: null };
    $scope.chat_url = "https://kiwiirc.com/client?settings=3eda7e82f0210b259be287b5bfa1a89d";
    $scope.chatShown = true;
    $scope.altStream = false;
    $scope.showPlaylist = false;
    $scope.streaming = false;

    $scope.updateValues = function() {
        $http.get("/api/properties").success(function(data) {
            $scope.properties = data["properties"];
            $scope.streaming = typeof($scope.properties.now_streaming) != "undefined" && $scope.properties.now_streaming != null && $scope.properties.now_streaming != "";

            var miralityIsStreaming = $scope.properties.now_streaming ? ($scope.properties.now_streaming.slice(0, 10) == 'Mirality -') : false;
            // TODO: who else wants a playlist?

            $scope.showPlaylist = miralityIsStreaming;
            $scope.playlist = ($scope.showPlaylist ? angular.fromJson($scope.properties.playlist) : null) || [];
        });
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
