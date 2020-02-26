let mobilenet;

let video;
let label = "";


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
  createCanvas(540, 450);
  video = createCapture(VIDEO);
  video.hide();
  background(0);
  mobilenet = ml5.imageClassifier("MobileNet", video, modelReady);

}

function draw() {
  background(0);
  image(video, 0, 0, width, height - 35);
  fill(255);
  textSize(25);
  text(label, 10, height - 10);
}