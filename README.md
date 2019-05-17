# AudioGestureKaraoke
6.835 Final Project: Karaoke controlled by audio and gesture (using Leap motion sensor)

## Setup

**product at link**: https://wangms.scripts.mit.edu/AudioGestureKaraoke/

Preferred browser for link: Google Chrome

please give the webpage permission to use your microphone to use the audio features. 

A Leap Motion sensor needs to be connected to use the gesture features. 


## List of files
- ./index.html: the front-end code for the web-app
- ./app/main.js: includes main code for all functionalities: 1) Youtube Widget 2) Queue Implementation 3) Gesture Recognition 4) Audio Commands

**note**: I removed my Youtube API Key from the main.js here. If you wish to download this file & run it, please create and retrived your own API KEY from Youtube following instructions at https://developers.google.com/youtube/v3/getting-started#before-you-start, and replace it at the top of main.js where it says

var YT_API_KEY = 'your_api_key';



The following files are referenced from 6.835 battleship miniproject: 
- .app/config.js: contains configuration constants
- .app/helpers.js: sets up speech synthesis
- .app/setup.js: sets up speech debugger / displayer
- .app/setupSpeech.js: sets up user speech processor

- .lib/*: imported libaries for speech recognition, jQuery, and Leap SDK. Files are named accordingly


