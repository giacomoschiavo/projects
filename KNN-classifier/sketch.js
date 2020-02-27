let video;
let features;
let knn;
let labelP;
let ready = false;

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  features = ml5.featureExtractor("MobileNet", video, modelReady);
  knn = ml5.KNNClassifier();
  labelP = createP("need data");
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
      labelP.html(result.label);
      goClassify();
    }
  })
}



function keyPressed() {
  const logits = features.infer(video);
  if (key == "a") {
    knn.addExample(logits, "left");
  } else if (key == "d") {
    knn.addExample(logits, "right");
  } else if (key == "s") {
    knn.addExample(logits, "center");
  }
}

function draw() {
  image(video, 0, 0, width, height);

  if(!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }
  
}