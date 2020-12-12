# P5 PoseNet Recorder

Record a sequence of PoseNet poses as a "movie" to a JSON file, for later
playback. This movie includes only the PoseNet data, not the video images.

You have the option to set in and out points (start and end points), before you
save the sequence. This allows you to omit the beginning of the sequence — when
you move away from the webcam into a position where you can use your whole body
– and the end of the sequence – when you move back towards the computer in order
to press the "Stop" button.

This project is designed to be used in conjunction with [P5 PoseNet
Player](https://github.com/osteele/p5pose-player).

Instructions:

1. Download this repository and open `index.html` in a browser. Give it
   permission to use your camera. You can also use the [online
   version](https://osteele.github.io/p5pose-recording/) instead of downloading
   the repository.
2. Move around. The web page is recording the keypoints.
3. Press the Stop button.
4. Drag the slider to review the recording.
5. Optionally, set an in point and out point, in order to save only part of the
   recording.
6. Press Save to save the file to `"poses.json"`. Subsequent saves will save to
   `"poses (1).json"` etc., depending on your browser.

If you are recording attempts to interact with elements in the canvas of another
sketch, you may find it helpful to take a screenshot of the other sketch and
modify `sketch.js` in this project to load and draw that screenshot. Then you
can see where the keypoints are relative to the target elements, as you move your body in order to move the keypoints.
