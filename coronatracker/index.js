// $.ajax({
//   url: 'https://thevirustracker.com/free-api?global=stats',
//   dataType: 'json',
//   success: function(data) {
//     console.log("Dati globali", data);
//     updateStates(data);
//   }
// });
//
$.ajax({
  url: 'https://thevirustracker.com/free-api?countryTotal=IT',
  dataType: 'json',
  success: data =>  updateStates(data)
});
//
// $.ajax({
//   url: 'https://thevirustracker.com/free-api?countryTimeline=IT',
//   dataType: 'json',
//   success: function(data) {
//     console.log("Timeline Italia", data);
//   }
// });

$.get('states.txt', createStates);

let allStates = {};


function createStates(data) {
  let states = data.match(/\b[A-Za-z_][^\s]*\b/g);
  for(let i = 0; i < states.length; i+=2) {
    allStates[states[i]] = states[i+1];
  }
}

let updateStates = (data) => {
  console.log("Finito loading")
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
}
