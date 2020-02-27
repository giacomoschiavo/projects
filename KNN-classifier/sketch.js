let video;
let features;
let knn;
let resultP;
let canvas;
let input;
let ready = false;
let classes = [];

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
      // select("#test1").style("width", result.confidences[0].toFixed(3) * 100 + "%");
      // select("#test2").style("width", result.confidences[1].toFixed(3) * 100 + "%");
      // select("#test3").style("width", result.confidences[2].toFixed(3) * 100 + "%");
      // console.log(result);
      goClassify();
    }
  })
}

function draw() {
  image(video, 0, 0, width, height);

  if (knn.getNumLabels() >= 2 && !ready) {
    goClassify();
    ready = true;
  }
}

function windowResized() {
  video.size(input.w, input.h);
  resizeCanvas(input.w, input.h);
}

function addClass(name, color="yellow") {
  if (exist(name) || classes.length > 4) return;

  let classDiv = createDiv();
  classDiv.class("class");

  let loadDiv = createDiv();
  loadDiv.id(name);
  loadDiv.style("background-color", color);

  let trainButton = createButton("Train \"" + name + "\"");
  trainButton.class("trainButton");
  trainButton.elt.addEventListener("mousedown", () => {
    console.log(1)
    knn.addExample(features.infer(video), name);
  });

  classDiv.child(loadDiv);
  classDiv.child(trainButton);

  classDiv.parent(select("#training"));

  classes.push({
    label: name,
    dom: classDiv
  });
}

function exist(name) {
  for (let i = 0; i < classes.length; i++)
    if (classes[i].label == name) return true;
  return false;
}

function onAddClass() {
  addClass(select("#inputClassName").value());
}
