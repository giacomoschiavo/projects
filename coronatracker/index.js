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

let createCountries = (data) => {
  console.log("File caricato");

  let countries = data.match(/\b[A-Za-z_][^\s]*\b/g);
  for (let i = 0; i < countries.length; i += 2) {
    let name = countries[i].replace(/_/g, " ");
    allCountry[name] = countries[i + 1];
  }

  console.log("Stati caricati");

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

  console.log("Dati aggiornati");
}


let createCountriesSelect = () => {
  let divSelect = $("#" + ACTIVECOUNTRY_DIV);

  let select = document.createElement("select");
  select.id = "country-select";
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
    success: data => callback(data, countryID)
  });
}

let getCountriesData = (callback) => {
  for (let key in allCountry) {
    getCountryData(allCountry[key], (data) => countriesData[key] = data);
  }

  let timer;
  timer = setInterval(() => {
    if(Object.keys(allCountry).length == Object.keys(countriesData).length){
      clearInterval(timer)
      callback();
    }
  }, 100);

}

let loadingFinished = () => {
  $("#loading-div").css("animation", "fadeout 1s ease forwards");
  updateMainCountry(defaultCountry);
}

$.get('states.txt', createCountries);
