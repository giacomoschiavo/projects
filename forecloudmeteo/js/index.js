//stringa per richiesta GET data la città
let urlCityName = "http://api.openweathermap.org/data/2.5/forecast?q=";

//stringa per richiesta GET data la posizione
let urlCoord = "http://api.openweathermap.org/data/2.5/forecast?";
//mio id
let id = "&appid=f9618f7331dc3735f2bbce10c9516ee0";

//string per richiedere le weather icon 
let icon = "http://openweathermap.org/img/w/";
let png = ".png";

//alla pressione di "INVIO" effettua la ricerca
window.addEventListener("keyup", function(event) {
  	event.preventDefault();
  	if (event.keyCode === 13) {
		document.getElementById("searchCity").click();
  	}
});

//richiesta GET data la città
function getInfo(){
	let city = document.getElementsByTagName("input")[0].value;

	//effettua richiesta, controlla risposta, aggiorna html
	fetch(urlCityName + city + id).then(handleInfo).then(res=>{updateInfo(res)});
}

//gestisci risposta
function handleInfo(data){
	if(data.ok){
		//non mostrare errore (nel caso fosse visibile)
		document.getElementsByClassName("error")[1].style.visibility = "hidden";
		return data.json();
	}
	else{
		//mostra errore
		document.getElementsByClassName("error")[1].style.visibility = "visible";

		throw new Error("City not found");
	}
}

function updateInfo(res){
	//div che contiene tutte le 
	let secondHalfBody = document.getElementById("second_half_body");

	//rimuovi tutti elementi figli di secondHalfBody
	while(secondHalfBody.firstChild){
		secondHalfBody.removeChild(secondHalfBody.firstChild);
	}

	//trasla la prima parte in alto
	updateFirstHalfBody();

	//crea paragrafo con città cercata
	let city = createCustomElement("p", "You searched for: " + res.city.name + ", " + res.city.country, "city_name");
	secondHalfBody.appendChild(city);

	//numero giorni di previsione
	let nDays = 5;
	//orari totali per giorno => 0, 3, 6, 9, 12, 15, 18, 21 => 8
	let nTabTime = 8;
	//contatore per dividere gli orari nei giorni giusti
	let indexCounter = 0;
	for(let i = 0; i < nDays; i++){
		//div di un giorno
		let tabDay = document.createElement("div");
		tabDay.classList.add("tab_day");

		//p che mostra il giorno
		let day = document.createElement("p");
		day.classList.add("tab_day_title");
		day.innerHTML = i === 0 ? "Today" : day.innerHTML = i === 1 ? "Tomorrow" : getDay(res, i);

		//div che descrive le sezioni => TIME, WEATHER, TEMP MIN, TEMP, TEMP MAX, HUMIDITY
		let description = createDescription();

		//div che contiene div di ogni orario
		let tabTimeContainer = document.createElement("div");
		tabTimeContainer.classList.add("tab_time_container");

		for(let z = 0; z < nTabTime; z++){
			//div di ogni orario
			let tabTime = document.createElement("div");
			tabTime.classList.add("tab_time");

			//estrai informazioni dal json
			let info = extractInfo(res, indexCounter);

			//prima tabella non deve tenere orario di mezzanotte
			if(info.time === "00" && z > 0 && indexCounter < 7){
				break;
			}
			//aggiorna elementi nei div con le info
			addInfo(tabTime, info);

			indexCounter++;
			tabTimeContainer.appendChild(tabTime);
		}
		tabDay.appendChild(day);
		tabDay.appendChild(description);
		tabDay.appendChild(tabTimeContainer);
		secondHalfBody.appendChild(tabDay);
	}
}

function updateFirstHalfBody(){
	let firstHalfBody = document.getElementById("first_half_body");
	firstHalfBody.style.marginTop = "15px";
}

function getDay(res, index){
	//gli orari sono massimo 8 per giorno
	return res.list[index * 8].dt_txt.substring(5, 10).replace('-', '/');
}

function createDescription(){
	let info = createCustomElement("div", "", "tab_info");
	info.appendChild(createCustomElement("p", "Time"));
	info.appendChild(createCustomElement("p", "Weather"));
	info.appendChild(createCustomElement("p", "Min", "tab_time_min"));
	info.appendChild(createCustomElement("p", "Temp"));
	info.appendChild(createCustomElement("p", "Max", "tab_time_max"));
	info.appendChild(createCustomElement("p", "Hum"));
	return info;
}

function addInfo(tabTime, info){
	let img = createCustomElement("img", "", "tab_time_img");
	img.src = info.imgSrc;

	tabTime.appendChild(createCustomElement("p", info.time, "tab_time_p"));
	tabTime.appendChild(img);
	tabTime.appendChild(createCustomElement("p", info.tempMin, "tab_time_p", "tab_time_min"));
	tabTime.appendChild(createCustomElement("p", info.temp, "tab_time_p"));
	tabTime.appendChild(createCustomElement("p", info.tempMax, "tab_time_p", "tab_time_max"));
	tabTime.appendChild(createCustomElement("p", info.humidity, "tab_time_p"));
}

function createCustomElement(element, text, ...className){
	let elem = document.createElement(element);
	elem.innerHTML = text;
	//ES6 si fa sentire!
	elem.classList.add(...className);
	return elem;
}

function extractInfo(res, index){
	let list = res.list[index];
	let info = {
		time: list.dt_txt.substring(11, 13),
		imgSrc: icon + list.weather[0].icon + png,
		temp: Math.round((list.main.temp - 273.15) * 10) / 10 + '°',
		tempMax: Math.round((list.main.temp_max - 273.15) * 10) / 10 + '°',
		tempMin: Math.round((list.main.temp_min - 273.15) * 10) / 10 + '°',
		humidity: list.main.humidity + '%'
	};
	return info;
}

//ottieni info dalla posizione
function getInfoFromCoord(){
	navigator.geolocation.getCurrentPosition(position => {
		//nascondi messaggio di permesso negato
		document.getElementsByClassName("error")[0].style.visibility = "hidden";

		//ottieni latitudine e longitudine
		let lat = Math.round(position.coords.latitude);
		let lon = Math.round(position.coords.longitude); 

		//effettua richiesta (ES6 si fa sentire di nuovo :))
		fetch(`${urlCoord}lat=${lat}&lon=${lon}${id}`).then(handleInfo).then(res=>{updateInfo(res)});
	}, err => document.getElementsByClassName("error")[0].style.visibility = "visible");
}

function error(err){
	
}

