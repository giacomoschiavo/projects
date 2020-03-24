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
    error: () => console.error(countryID + "not reached")
  });
}

let getCountriesData = (callback) => {
  for (let key in allCountry) {
    getCountryData(allCountry[key], (data) => countriesData[key] = data);
  }

  let timer;
  timer = setInterval(() => {
    if (Object.keys(allCountry).length == Object.keys(countriesData).length) {
      clearInterval(timer)
      callback();
    }
  }, 10);
}

let loadingFinished = () => {
  updateMainCountry(defaultCountry);
  sortCountries();
}

$("#loading-div").css("animation", "fadeout 1s ease forwards");
let createState = (country) => {

  let stateDiv = document.createElement("div");
  stateDiv.classList.add("state");

  let nameP = document.createElement("p");
  nameP.innerHTML = country;
  nameP.classList.add("name-state")

  let deaths = document.createElement("div");
  deaths.classList.add("deaths", "tag");
  let deathsP = document.createElement("p");
  deathsP.innerHTML = countriesData[country].countrydata[0].total_deaths;
  deaths.append(deathsP);

  let recovered = document.createElement("div");
  recovered.classList.add("recovered", "tag");
  let recoveredP = document.createElement("p");
  recoveredP.innerHTML = countriesData[country].countrydata[0].total_recovered;
  recovered.append(recoveredP);

  let total = document.createElement("div");
  total.classList.add("total", "tag");
  let totalP = document.createElement("p");
  totalP.innerHTML = countriesData[country].countrydata[0].total_cases;
  total.append(totalP);

  stateDiv.append(nameP);
  stateDiv.append(deaths);
  stateDiv.append(recovered);
  stateDiv.append(total);

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
