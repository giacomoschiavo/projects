let video;
let features;
let knn;
let resultP;
let canvas;
let input;
let ready = false;
let classes = [];
let e;

function setup() {
  input = {
    w: select("#input").width,
    h: select("#input").width
  };
  canvas = createCanvas(input.w, input.h);
  canvas.parent("input");
  video = createCapture(VIDEO, cameraLoaded);
  video.size(input.w, input.h);
  video.hide();
  features = ml5.featureExtractor("MobileNet", video, modelReady);
  knn = ml5.KNNClassifier();
  resultP = select("#result").html("need data");
  addClass("ciao", "blue");
}

function modelReady() {
  console.log("Model is ready");
}

function cameraLoaded() {
  console.log("Camera is ready");
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
  image(video, -80, -0, width + 80, height + 0);

  if (knn.getNumLabels() >= 2 && !ready) {
    goClassify();
    ready = true;
  }
}

function windowResized() {
  video.size(input.w, input.h);
  resizeCanvas(input.w, input.h);
}

function addClass(name, color = "yellow") {
  if (exist(name) || classes.length > 4 || name == "") return;

  let classDiv = createDiv();
  classDiv.class("class");

  let loadDiv = createDiv();
  loadDiv.id(name);
  loadDiv.class("confidence");
  loadDiv.style("background-color", color);

  let trainButton = createButton("Train \"" + name + "\"");
  trainButton.class("trainButton");
  trainButton.elt.addEventListener("mousedown", (ev) => {
    // e = ev;
    let children = ev.path[1].children;
    for(let i = 0; i < children.length; i++) {
      if(children[i].className == "snapshots") {
        children[i].prepend(capture());
      }
    }
    knn.addExample(features.infer(video), name);
  });

  let imgDiv = createDiv();
  imgDiv.class("snapshots");

  classDiv.child(loadDiv);
  classDiv.child(imgDiv);
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
  addClass(select("#inputClassName").value(), select("#colorClass").value());
  select("#inputClassName").value("");
  select("#colorClass").value("#666666");
}

function capture() {
  let img = new Image();
  img.src = canvas.elt.toDataURL();
  return img;
}
