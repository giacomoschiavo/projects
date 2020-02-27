let video;
let features;
let knn;
let resultP;
let canvas;
let input;
let ready = false;

function setup() {
  input = {
    w: select("#input").width,
    h: select("#input").width / 4 * 3
  };
  canvas = createCanvas(input.w, input.h);
  canvas.parent("input");
  video = createCapture(VIDEO);
  video.size(input.w, input.h);
  video.hide();
  features = ml5.featureExtractor("MobileNet", video, modelReady);
  knn = ml5.KNNClassifier();
  resultP = select("#result").html("need data");
}

function modelReady() {
  console.log("Model is ready");
}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      resultP.html(result.label);
      select("#test1").style("width", result.confidences[0].toFixed(3)*100 + "%");
      select("#test2").style("width", result.confidences[1].toFixed(3)*100 + "%");
      select("#test3").style("width", result.confidences[2].toFixed(3)*100 + "%");
      // console.log(result);
      goClassify();
    }
  })
}

function draw() {
  image(video, 0, 0, width, height);

  if(knn.getNumLabels() == 3 && !ready) {
    goClassify();
    ready = true;
  }
}

function windowResized() {
  video.size(input.w, input.h);
  resizeCanvas(input.w, input.h);
}

function test1add() {
  knn.addExample(features.infer(video), "test1");
}

function test2add() {
  knn.addExample(features.infer(video), "test2");
}

function test3add() {
  knn.addExample(features.infer(video), "test3");
}
