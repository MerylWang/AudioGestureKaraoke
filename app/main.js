
// for 6.835 staff: Please retreve & insert your YOUTUBE API KEY here
var YT_API_KEY = 'your_api_key';

//////////////////////////
// UI SETUP            //
///////////////////////
setupUserInterface();

//////////////////////////
// UI: Youtube Widget //
///////////////////////
// source : https://developers.google.com/youtube/iframe_api_reference#Getting_Started

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
    videoId: SONG_IDS[0], // TODO: CHANGE THIS
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
  player.getVideoUrl()
  if (!(player.getVideoUrl().includes(SONG_IDS[0]))) { // if first video in queue is not playing
    SONG_IDS.shift(); // pops first element
    updateQueue(SONG_IDS);
    player.loadPlaylist(SONG_IDS);
  }
}

///////////////////////////
// QUEUE IMPLEMENTATION //
/////////////////////////
var SONG_IDS = ['Mm2kTNzo2aY', 'q2UVTPlKZtQ']; // initial queue
function searchSong() {
   // input: user search query for song title (string)
   // output: add first result to QUEUE
   var query = document.getElementById("query-input").value;
   searchSongHelper(query);
}

function searchSongHelper(song_name) {
   // song_name: user search query for song title (string)
   // output: add first result to QUEUE
   var videoId = getvideoId(song_name);
   SONG_IDS.push(videoId);
   updateQueue(SONG_IDS);

   // avoid player getting stucks
   if (SONG_IDS.length == 2){
    player.loadPlaylist(SONG_IDS);
   }
}

function loadList() {
    // loads playlist
    player.loadPlaylist(SONG_IDS);
    updateQueue(SONG_IDS);
}

// load queue after window finishes loading
window.onload = loadList;

function updateQueue(song_ids) {
  // updates HTML queue based on list of videoIds
  var queue = document.getElementById("queue");
  var total = "";

  for (var i = 0; i < song_ids.length; i++) {
  	total += "<li><span></span> </li>";
  }

  queue.innerHTML = total;

  for (var i = 0; i < song_ids.length; i++) {
  	var span = queue.children[i].children[0];
    var title = idToTitle(song_ids[i]);
    span.innerText = title;
  }
}

function getvideoId(query) {
  // given search query (string), return videoId of top result
  var word = query.trim().replace(" " , "+");
  word += "+karaoke";
  var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&q="+word+"+&type=video+&videoDefinition=high&videoEmbeddable=true&key="+YT_API_KEY;

  var result = $.ajax({
  url: url,
  async  : false
  });

  return result.responseJSON.items[0].id.videoId;
}

function idToTitle(videoId) {
  // given videoId (string), gets video title (string)
  // youtube data api: https://developers.google.com/youtube/v3/getting-started
  var title = $.ajax({
  url: "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + YT_API_KEY,
  async  : false
  });

  return title.responseJSON.items[0].snippet.title;
}

//////////////////////////
// GESTURE RECOGNITION //
////////////////////////
// gesture recognition package: https://developer-archive.leapmotion.com/documentation/v2/javascript/devguide/Leap_Gestures.html?proglang=javascript

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
  // if loops <= 100, gesture recognition is not active.
  // this is to prevent sensor from catching many gestures at once
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

    for (var i = 0; i < uniq.length; i++) {
      var gesture = uniq[i];

      if (gesture.type == "swipe") {

          //Classify swipe as either horizontal or vertical
          var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
          //Classify as right-left or up-down
          if(isHorizontal){
              if(gesture.direction[0] > 0){
                  swipeDirection = "right";
                  loops=0;
                  // next song in queue iff exists
                  generateSpeech("next video");
                  player.nextVideo();
              } else {
                  swipeDirection = "left";
              }
          } else { //vertical swipe
              if(gesture.direction[1] > 0){
                  swipeDirection = "up";
                  loops=0;
                  generateSpeech("volume up");
                  var vol = player.getVolume() + 10; // TODO: make into variables
                  player.setVolume(vol.clamp(0,100));
              } else {
                  swipeDirection = "down";
                  loops=0;
                  generateSpeech("volume down");
                  var vol = player.getVolume() - 10; // TODO: make into variables
                  player.setVolume(vol.clamp(0,100));
              }
          }

       } else if (gesture.type == "keyTap" || gesture.type == "screenTap") {
         // play / pause video
         loops=0;
         if (player.getPlayerState() == 1) { // if playing
           generateSpeech("pause");
           player.pauseVideo();
         } else if (player.getPlayerState() == 2) { // if paused
           generateSpeech("play");
           player.playVideo();
         }

       } else if (gesture.type == "circle") {
         // restart video
         loops=0;
         generateSpeech("restart");
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

  if (userSaid(transcript, ['karaoke'])) { // audio command keyword

    // prioritized in case song name contains other command keywords
     if (userSaid(transcript, ['add'])) {
      var song_name = transcript.substring(transcript.indexOf("add")+3, transcript.length);
      // console.log("add song", song_name);
      generateSpeech("add " + song_name);
      searchSongHelper(song_name);

    } else if (userSaid(transcript, ['play', 'resume'])) {
      generateSpeech("play");
      player.playVideo();

    } else if (userSaid(transcript, ['stop', 'pause'])) {
      generateSpeech("pause");
      player.pauseVideo();

    } else if (userSaid(transcript, ['restart']) && player.getCurrentTime()>=5) {
      // console.log("current time ", player.getCurrentTime());
      generateSpeech("restart");
      player.seekTo(Number('00'), true);

    } else if (userSaid(transcript, ['up', 'loud', 'louder'])) {
      generateSpeech("volume up");
      var vol = player.getVolume() + 10;
      player.setVolume(vol.clamp(0,100));

    } else if (userSaid(transcript, ['down', 'quiet', 'quieter', 'soft', 'softer'])) {
      generateSpeech("volume down");
      var vol = player.getVolume() - 10;
      player.setVolume(vol.clamp(0,100));
    }
    else if (userSaid(transcript, ['next', 'skip', 'cut'])) {
      generateSpeech("next video");
      player.nextVideo();
    }
  }
};
