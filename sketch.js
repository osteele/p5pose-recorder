let cam;
let timeline;
let isRecording = true;
let poses = [];
let currentPose;
let inPoint, outPoint;

function setup() {
  createCanvas(640, 480);
  cam = createCapture(VIDEO);
  cam.size(width, height);

  let poseNet = ml5.poseNet(
    cam, {
    flipHorizontal: true,
    detectionType: "single"
  },
    () => {
      document.body.className = "recording";
    }
  );

  poseNet.on("pose", ([pose]) => {
    if (pose && isRecording) {
      pose.timestamp = millis();
      currentPose = pose;
      poses.push(currentPose);
    }
  });

  cam.hide();
  buttons();
}

function buttons() {
  createButton("Record")
    .class("unless-recording")
    .position(10, 30)
    .mousePressed(() => {
      isRecording = true;
      document.body.className = "recording";
      poses = [];
    });

  createButton("Stop")
    .class("if-recording")
    .position(10, 30)
    .mousePressed(() => {
      isRecording = false;
      document.body.className = poses.length > 0 ? "editing" : "";
      inPoint = 0;
      outPoint = poses.length;
      timeline.value(0);
      timeline.attribute("max", poses.length);
    });

  timeline = createSlider(0).style("width", `${width}px`).class("if-editing");

  createButton("Set In-Point")
    .class("if-editing")
    .position(100, 440)
    .mousePressed(() => {
      inPoint = timeline.value();
      if (inPoint >= outPoint) outPoint = poses.length - 1;
    });

  createButton("Set Out-Point")
    .class("if-editing")
    .position(520, 440)
    .mousePressed(() => {
      outPoint = timeline.value();
      if (inPoint >= outPoint) inPoint = 0;
    });

  createButton("Save")
    .class("if-editing")
    .position(10, 440)
    .mousePressed(() => {
      let startTime = poses[0].timestamp;
      let clip = poses
        .slice(inPoint, outPoint)
        .map((pose) => ({
          ...pose,
          timestamp: pose.timestamp - startTime
        }));
      saveJSON({
        version: 1,
        poses: clip
      }, "poses.json");
    });
}

function draw() {
  push();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);
  if (!isRecording) {
    filter(GRAY);
  }
  pop();

  fill(0);
  stroke(255);
  text(`${poses.length} poses recorded`, 10, 20);

  if (!isRecording) {
    fill(0, 128, 0, 100);
    noStroke();
    rect(
      (inPoint * width) / poses.length,
      height,
      ((outPoint - inPoint) * width) / poses.length,
      -10
    );
  }
  if (!isRecording) {
    currentPose = poses[timeline.value()];
  }

  if (currentPose) {
    drawKeypoints(currentPose);
    drawSkeleton(currentPose);
  }
}

function drawKeypoints(pose) {
  for (let keypoint of pose.pose.keypoints) {
    if (keypoint.score > 0.2) {
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }
}

function drawSkeleton(pose) {
  for (let skeleton of pose.skeleton) {
    let [p1, p2] = skeleton;
    stroke(0, 0, 255);
    line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
  }
}
