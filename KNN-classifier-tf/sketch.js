let video;
let features;
let knn;
let canvas;
let input;
let ready = false;
let classes = [];
let resultP;

const CLASS_LIMIT = 8;
const INITIAL_LABEL = "I need data🤩";
const CLASSNAME_BUTTON = "trainButton";
const CAMERA_CONTAINER_ID = "input";
const SNAPSHOTS_POSITION = 1;

function setup() {

  // input = {
  //   w: select("#" + CAMERA_CONTAINER_ID).width,
  //   h: select("#" + CAMERA_CONTAINER_ID).width
  // };
  input = select("#" + CAMERA_CONTAINER_ID);

  video = createCapture(VIDEO, loadCanvas);
  // video.size(input.w, input.h);
  video.hide();

  features = ml5.featureExtractor("MobileNet", video, modelReady);
  knn = ml5.KNNClassifier();

  resultP = createP(INITIAL_LABEL);
  resultP.id("result");

  resultP.parent(CAMERA_CONTAINER_ID);
}

function loadCanvas() {
  // let newHeight = video.width;
  // video.width = video.height;
  // video.height = video.width;
  canvas = createCanvas(video.width, video.height);
  canvas.parent(CAMERA_CONTAINER_ID);
  resizeCamera();
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
      updateBar(result);
      goClassify();
    }
  })
}

function updateBar(result) {
  let results = result.confidencesByLabel;
  for (let item in results) {
    select("#" + item).style("width", results[item].toFixed(3) * 100 + "%")
  }
}

function draw() {
  image(video, 0, 0, width, height);

  if (knn.getNumLabels() >= 2 && !ready) {
    goClassify();
    ready = true;
  }
}

function addClass(name, color = "yellow") {
  if (exist(name) || classes.length >= CLASS_LIMIT || name == "") return;

  let classDiv = createDiv();
  classDiv.class("class");

  let loadDiv = createDiv();
  loadDiv.id(name);
  loadDiv.class("confidence");
  loadDiv.style("background-color", color);

  let trainButton = createButton("<span>TRAIN \"" + name + "\"</span>");
  trainButton.class(CLASSNAME_BUTTON);
  trainButton.style("background-color", color);

  trainButton.elt.addEventListener("mousedown", (e) => {
    let snapCont = e.path[2].childNodes[SNAPSHOTS_POSITION];
    let img = capture();
    snapCont.prepend(img);
    knn.addExample(features.infer(video), name);
  });

  let imgDiv = createDiv();
  imgDiv.class("snapshots");

  classDiv.child(loadDiv);
  classDiv.child(imgDiv);
  classDiv.child(trainButton);

  classDiv.parent(select("#class-cont"));

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
  addClass(select("#inputClassName").value(), select("#colorClass").value());
  select("#inputClassName").value("");
  select("#colorClass").value("#ff0000");
}

function capture() {
  let img = new Image();
  img.src = canvas.elt.toDataURL();
  return img;
}

function resizeCamera() {
  var aspectRatio = video.width / video.height;
  console.log(input.width / aspectRatio)
  resizeCanvas(input.elt.clientWidth, input.elt.clientWidth / aspectRatio);
}

function windowResized() {
  resizeCamera();
}
