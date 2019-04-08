//////////////////////////
// UI: Youtube Widget //
///////////////////////

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'x5cBBXXFAPQ', // TODO: CHANGE THIS
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
};


//////////////////////////
// GESTURE RECOGNITION //
////////////////////////
var controllerOptions = {enableGestures: true};

Leap.loop(controllerOptions, function(frame) {

  // Display Gesture object data
  if (frame.gestures.length > 0) {
    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];

      // swipe
      if(gesture.type == "swipe") {
          //Classify swipe as either horizontal or vertical
          var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
          //Classify as right-left or up-down
          if(isHorizontal){
              if(gesture.direction[0] > 0){
                  swipeDirection = "right";
              } else {
                  swipeDirection = "left"; // no action
              }
          } else { //vertical
              if(gesture.direction[1] > 0){
                  swipeDirection = "up";
              } else {
                  swipeDirection = "down";
              }
          }
          // TODO: do someething with swipeDirection
          console.log(swipeDirection);
       } else if (gesture.type == "screenTap") {
         // play / pause
         if (player.getPlayerState() == 1) { // if playing
           player.pauseVideo();
         } else if (player.getPlayerState() == 2) { // if paused
           player.playVideo();
         }

       } else if (gesture.type == "circle") {
         // replay
         player.seekTo(0, true);
       }
     }
  }
});
