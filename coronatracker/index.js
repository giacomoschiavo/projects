const COUNTRY_TOTAL_URL = "https://thevirustracker.com/free-api?countryTotal=";
const ACTIVECOUNTRY_DIV = "active-country";
// let mainState = allCountry["Italy"];

//
// $.ajax({
//   url: 'https://thevirustracker.com/free-api?countryTimeline=IT',
//   dataType: 'json',
//   success: function(data) {
//     console.log("Timeline Italia", data);
//   }
// });

//aggiungi callback
let defaultCountry = "Italy";

let allCountry = {};
let countriesData = {};

let hasError = false;


let changedCountry = (index) => {
  updateMainCountry(index.target.value)
}

let createCountries = (data) => {
  console.log("File caricato");

  let countries = data.match(/\b[A-Za-z_][^\s]*\b/g);
  for (let i = 0; i < countries.length; i += 2) {
    let name = countries[i].replace(/_/g, " ");
    allCountry[name] = countries[i + 1];
  }

  createCountriesSelect();
  getCountriesData(loadingFinished);
}


let updateMainCountry = (countryID) => {
  let countrydata = countriesData[countryID].countrydata[0];

  let activeCases = countrydata.total_active_cases;
  let deaths = countrydata.total_deaths;
  let recovered = countrydata.total_recovered;
  let totalCases = countrydata.total_cases;

  $("#active-cases-text").text(activeCases);
  $("#deaths-text").text(deaths);
  $("#recovered-text").text(recovered);
  $("#total-cases-text").text(totalCases);
}


let createCountriesSelect = () => {
  let divSelect = $("#" + ACTIVECOUNTRY_DIV);

  let select = document.createElement("select");
  select.classList.add("centered");
  select.id = "country-select";
  select.onchange = changedCountry;
  for (let key in allCountry) {
    let option = document.createElement("option");
    if (key == defaultCountry) {
      option.selected = true;
    }
    option.classList.add("country-option");
    option.value = key;
    option.innerHTML = key;
    select.append(option);
  }

  divSelect.append(select);
}

let getCountryData = (countryID, callback) => {
  $.ajax({
    url: COUNTRY_TOTAL_URL + countryID,
    dataType: 'json',
    success: data => callback(data, countryID),
    error: () => hasError = true
  });
}

let getCountriesData = (callback) => {
  for (let key in allCountry) {
    getCountryData(allCountry[key], (data) => countriesData[key] = data);
  }

  let timer;
  timer = setInterval(() => {
    let ratio = Object.keys(countriesData).length / Object.keys(allCountry).length;
    $("#loading-bar").css("width", ratio * 100 + "%")
    if (ratio == 1) {
      clearInterval(timer);
      callback();
    }

    if(hasError) {
      $("#loading-error").css("display", "block");
      clearInterval(timer)
    }
  }, 100);
}

let loadingFinished = () => {
  updateMainCountry(defaultCountry);
  sortCountries();
  $("#loading-div").css("animation", "fadeout 1s ease forwards");
}

let createState = (country) => {

  let stateDiv = document.createElement("div");
  stateDiv.classList.add("state");

  let nameP = document.createElement("p");
  nameP.innerHTML = country;
  nameP.classList.add("name-state")

  let divInfos = document.createElement("div");
  divInfos.classList.add("info-state")

  let labels = ["deaths", "recovered", "total"];
  let dataLabels  = ["total_deaths", "total_recovered", "total_cases"]

  for(let i = 0; i < labels.length; i++) {
    let div = document.createElement("div");
    div.classList.add(labels[i], "tag");
    let p = document.createElement("p");
    p.innerHTML = countriesData[country].countrydata[0][dataLabels[i]];
    let sub = document.createElement("p");
    sub.classList.add("sub-state")
    sub.innerHTML = labels[i].charAt(0).toUpperCase() + labels[i].slice(1);
    div.append(p);
    div.append(sub);
    divInfos.append(div)
  }

  stateDiv.append(nameP);
  stateDiv.append(divInfos);

  $("#sec").append(stateDiv);
}

let sortCountries = () => {
  // [["Italy", 43242], ["Russia", 100]]
  let nameCase = [];

  for (let key in countriesData) {
    let cases = countriesData[key].countrydata[0].total_cases;
    nameCase.push([key, cases]);
  }

  nameCase.sort((a, b) => b[1] - a[1])

  for (let i = 0; i < nameCase.length; i++) {
    createState(nameCase[i][0]);
  }
}

$.get('states.txt', createCountries);
