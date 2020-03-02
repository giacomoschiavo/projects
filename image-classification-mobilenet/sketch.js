let mobilenet;

let video;
let label = "";

let labelP;

function modelReady() {
  console.log("Model is ready");
  mobilenet.predict(gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    label = result[0].label;
    let prob = result[0].confidence;
    mobilenet.predict(gotResults);
  }
}

function setup() {
  let canvas = createCanvas(540, 450);
  canvas.parent("canvas-cont");
  video = createCapture(VIDEO, cameraLoaded);
  video.hide();
  background(0);
  mobilenet = ml5.imageClassifier("MobileNet", video, modelReady);
  labelP = select("#labels");
  resizeCamera();
}

function cameraLoaded() {
  resizeCamera();
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  labelP.html(label);
}

function resizeCamera() {
  let aspectRatio = video.width / video.height;
  let cont = select("#canvas-cont");
  resizeCanvas(cont.elt.clientWidth, cont.elt.clientWidth / aspectRatio);
}
