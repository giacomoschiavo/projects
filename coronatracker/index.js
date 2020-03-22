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
let defaultCountry = "IT";

let allCountry = {};


let createCountries = (data) => {
  console.log("File caricato");

  let countries = data.match(/\b[A-Za-z_][^\s]*\b/g);
  for (let i = 0; i < countries.length; i += 2) {
    allCountry[countries[i]] = countries[i + 1];
  }

  console.log("Stati caricati");

  createCountriesSelect();
  //
  // for (let key in allCountry) {
  //   getCountryData(allCountry[key], (data) => console.log(data.countrydata[0].total_deaths));
  // }
  //
  getCountryData(defaultCountry, updateMainCountry);
}

let getCountryData = (countryID, successFun) => {
  $.ajax({
    url: COUNTRY_TOTAL_URL + countryID,
    dataType: 'json',
    success: data => successFun(data)
  });
}

let updateMainCountry = (data) => {
  console.log("Dati su stato ricevuti");
  $("#loading-div").css("animation", "fadeout 1s ease forwards");

  let countrydata = data.countrydata[0];

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

let setup = () => {
  $.get('states.txt', createCountries);
}

let createCountriesSelect = () => {
  // <label for="cars">Choose a car:</label>
  // <select id="cars">
  //   <option value="volvo">Volvo</option>
  //   <option value="saab">Saab</option>
  //   <option value="mercedes">Mercedes</option>
  //   <option value="audi">Audi</option>
  // </select>

  let divSelect = $("#" + ACTIVECOUNTRY_DIV);

  let select = document.createElement("select");
  select.id = "country-select";
  for (let key in allCountry) {
    let option = document.createElement("option");
    if (allCountry[key] == defaultCountry) {
      option.selected = true;
    }
    option.classList.add("country-option");
    option.value = key;
    option.innerHTML = key;
    select.append(option);
  }

  divSelect.append(select);

}

setup();
