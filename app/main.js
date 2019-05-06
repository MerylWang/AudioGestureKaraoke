//////////////////////////
// UI SETUP            //
///////////////////////
setupUserInterface();

//////////////////////////
// UI: Youtube Widget //
///////////////////////

// setInterval(updateQueue, 1000);

// queue //
var SONGS = ['ajtFz7RYdj4','Mm2kTNzo2aY', 'B6GC83lTT5E', 'SFjiWJt2yU0', 'q2UVTPlKZtQ', 'szROVj0Swcs'];
var TITLES = {'ajtFz7RYdj4': "7 Rings",
              'Mm2kTNzo2aY':"Alexander Hamilton",
              'B6GC83lTT5E': "Reflection",
              'SFjiWJt2yU0': "What I've Done",
              'q2UVTPlKZtQ': "Hello",
              'szROVj0Swcs': "All of Me"};



function updateQueue(songs) {
  console.log("update queue");
  var queue = document.getElementById("queue");
  var total = "";

  for (var i = 0; i < songs.length; i++) {
  	total += "<li><span></span> </li>";
  }

  queue.innerHTML = total;

  for (var i = 0; i < songs.length; i++) {
  	var span = queue.children[i].children[0];
    var title = TITLES[songs[i]];
    console.log("title: ", title);
    span.innerText = title;
  }
}



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
    height: '520',
    width: '850',
    videoId: 'ajtFz7RYdj4', // TODO: CHANGE THIS
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

// queue
function loadList() {
  console.log("loading list");
    player.loadPlaylist(SONGS);
    updateQueue(SONGS);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

var done = false;
function onPlayerStateChange(event) {
  player.getVideoUrl()
  if (!(player.getVideoUrl().includes(SONGS[0]))) { // if first video in queue is not playing
    SONGS.shift(); // pops first element
    updateQueue(SONGS);
    // setTimeout(stopVideo, 6000);
    // done = true;
  }
}

// function stopVideo() {
//   player.stopVideo();
// };


// setTimeout(loadList, 10000);
window.onload = loadList;


//////////////////////////
// GESTURE RECOGNITION //
////////////////////////

var SWIPE_DURATION  = 0000; // ms
var SWIPE_SPEED     = 0;
var CIRCLE_DURATION = 1000000; // ms
var RADIUS           = 50;      // mm
var loops = 0;


var controllerOptions = {enableGestures: true};

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this,min), max);
};

Leap.loop(controllerOptions, function(frame) {
  loops+=1;
  // Display Gesture object data
  if (loops>100) {
    console.log("activia");
  }
  if (frame.gestures.length > 0 && loops>100) {
    console.log("active");

    // convert to gesture type
    var foundSwipe = false;
    var foundTap = false;
    var foundCircle = false;
    var uniq = new Array();

    for (var i=0; i<frame.gestures.length; i++) {
      if (frame.gestures[i].type=="swipe" && !foundSwipe) {
        uniq.push(frame.gestures[i]);
        foundSwipe=true;
      }
      if ((frame.gestures[i].type=="keyTap" || frame.gestures[i].type == "screenTap") && !foundTap) {
        uniq.push(frame.gestures[i]);
        foundTap = true;
      }
      if (frame.gestures[i].type=="circle" && !foundCircle) {
        uniq.push(frame.gestures[i]);
        foundCircle=true;
      }
    }

    console.log("uniq: ", uniq);

    for (var i = 0; i < uniq.length; i++) {
      var gesture = uniq[i];

      // swipe
      // if (gesture.type == "swipe" && gesture.duration > SWIPE_DURATION && gesture.speed > SWIPE_SPEED) {
      if (gesture.type == "swipe") {

          //Classify swipe as either horizontal or vertical
          var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
          //Classify as right-left or up-down
          if(isHorizontal){
              if(gesture.direction[0] > 0){
                  swipeDirection = "right";
                  loops=0;
                  // TODO: next song in queue iff exists
                  player.nextVideo();
              } else {
                  swipeDirection = "left";
                  loops=0;
                  // TODO previous song in queue iff exists
                  player.previousVideo();
              }
          } else { //vertical
              if(gesture.direction[1] > 0){
                  swipeDirection = "up";
                  loops=0;
                  var vol = player.getVolume() + 10; // TODO: make into variables
                  player.setVolume(vol.clamp(0,100));
              } else {
                  swipeDirection = "down";
                  loops=0;
                  var vol = player.getVolume() - 10; // TODO: make into variables
                  player.setVolume(vol.clamp(0,100));
              }
          }
          console.log(swipeDirection);
          // console.log(gesture.duration);
          // console.log("swipe speed " + gesture.speed);

       } else if (gesture.type == "keyTap" || gesture.type == "screenTap") {
         // play / pause
         loops=0;
         console.log("tap: " + gesture.type);
         if (player.getPlayerState() == 1) { // if playing
           player.pauseVideo();
         } else if (player.getPlayerState() == 2) { // if paused
           player.playVideo();
         }

       // } else if (gesture.type == "circle" && gesture.radius > RADIUS && gesture.duration > CIRCLE_DURATION) {
       } else if (gesture.type == "circle") {
         console.log("circle");
         loops=0;
         // replay
         player.seekTo(Number('00'), true);
       }
     }
  }


});


//////////////////////////
// AUDIO RECOGNITION //
////////////////////////

// Helper function to detect if any commands appear in a string
var userSaid = function(str, commands) {
  for (var i = 0; i < commands.length; i++) {
    if (str.indexOf(commands[i]) > -1)
      return true;
  }
  return false;
};


var processSpeech = function(transcript) {
  transcript = transcript.toLowerCase();
  // console.log("transcript: " + transcript);
  if (userSaid(transcript, ['karaoke'])) { // audio command keyword
    if (userSaid(transcript, ['play', 'resume'])) {
      player.playVideo();

    } else if (userSaid(transcript, ['stop', 'pause'])) {
      player.pauseVideo();

    } else if (userSaid(transcript, ['restart']) && player.getCurrentTime()>=5) {
      console.log("current time ", player.getCurrentTime());
      player.seekTo(Number('00'), true);

    } else if (userSaid(transcript, ['up', 'loud', 'louder'])) {
      var vol = player.getVolume() + 10; // TODO: make into variables
      player.setVolume(vol.clamp(0,100));

    } else if (userSaid(transcript, ['down', 'quiet', 'quieter', 'soft', 'softer'])) {
      var vol = player.getVolume() - 10; // TODO: make into variables
      player.setVolume(vol.clamp(0,100));
    }
  }


};
