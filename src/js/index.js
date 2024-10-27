import "../css/style.css"; /*  for importing style.css */
import { getElementFromDOM } from "./utilityFunctions";
import { CurrentLocation } from "./currentLocation";
import {
  setPlaceholderText,
  addSpinner,
  displayError,
  updateScreenReaderMsg,
  updateWeatherLocationHeader,
  displayApiErrror,
  updateDisplay,
} from "./domFunctions";
import {
  setLocationObj,
  getHomeLocation,
  cleanText,
  getCoordsFrmAPI,
  getWeatherFromCoords,
} from "./dataFunction";

//object creation

const currentLocObjFrmCls = new CurrentLocation();
console.log(currentLocObjFrmCls);

// dom loaded
document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  // adding event listener
  const geoBtn = getElementFromDOM("id", "getLocation"); // give arguments in strings and 1st one is selector type and the 2nd one selector name(id,tag,class,querySelector,querySelectorAll)
  geoBtn.addEventListener("click", getGeoWeather);

  const homeBtn = getElementFromDOM("id", "home");
  homeBtn.addEventListener("click", loadWeather);

  const saveBtn = getElementFromDOM("id", "saveLocation");
  saveBtn.addEventListener("click", saveCurrentLocation);

  const toggleBtn = getElementFromDOM("id", "unit");
  toggleBtn.addEventListener("click", setUnitPreference);

  const refreshBtn = getElementFromDOM("id", "refresh");
  refreshBtn.addEventListener("click", refreshWeather);

  const locationEntry = getElementFromDOM("id", "searchBar__form");
  locationEntry.addEventListener("submit", submitNewLocation);

  setPlaceholderText();

  loadWeather();
}

// getting geo weather

function getGeoWeather(event) {
  if (event) {
    if (event.type === "click") {
      const mapIcon = getElementFromDOM("querySelector", ".fa-map-marker-alt");
      addSpinner(mapIcon);
    }
  }
  if (!navigator.geolocation) geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

// setting geo Error

function geoError(errObj) {
  const errMsg = errObj ? errObj.message : "Geolocation is not supported";
  console.log(
    "Error accessing geo location",
    errObj.message || "Gelocation is not supported",
    errObj
  );

  displayError(errMsg, errMsg);
}

// handle success for geoloaction

function geoSuccess(position) {
  const liveLocationObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat ${position.coords.latitude} and lon ${position.coords.longitude}`,
  };
  console.log("Got geo location", liveLocationObj);

  setLocationObj(currentLocObjFrmCls, liveLocationObj);
  updateDataAndDisplay(currentLocObjFrmCls);
}

// loading weather

function loadWeather(event) {
  const savedLoc = getHomeLocation();
  if (!savedLoc && !event) {
    return getGeoWeather();
  } else if (!savedLoc && event.type === "click") {
    displayError(
      "Home location is not saved. So please save the location first",
      "Home location is not saved. So please save the location first"
    );
  } else if (savedLoc && !event) {
    displayHomeLocationWeather();
  } else {
    const homeIcon = getElementFromDOM("querySelector", ".fa-home");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLoc);
  }
}

// displayin home location weather

function displayHomeLocationWeather(homeLoc) {
  if (typeof homeLoc === "string") {
    const locationJson = JSON.parse(homeLoc);
    const savedLocObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObj(currentLocObjFrmCls, savedLocObj);
    updateDataAndDisplay(currentLocObjFrmCls);
  }
}

// saving current location to storage

function saveCurrentLocation() {
  if (currentLocObjFrmCls.lat && currentLocObjFrmCls.lon) {
    const saveIcon = getElementFromDOM("querySelector", ".fa-save");
    addSpinner(saveIcon);
    const currentLocObj = {
      lat: currentLocObjFrmCls.lat,
      lon: currentLocObjFrmCls.lon,
      name: currentLocObjFrmCls.name,
      unit: currentLocObjFrmCls.unit,
    };
    console.log("saving current location to local storage", currentLocObj);

    localStorage.setItem("savedLocation", JSON.stringify(currentLocObj));
    updateWeatherLocationHeader(
      `Current location ${currentLocObjFrmCls.name} is saved`
    );
    updateScreenReaderMsg(
      "Current location ${currentLocObjFrmCls.name} is saved"
    );
  }
}

// setting unit preference

function setUnitPreference() {
  const unitIcon = getElementFromDOM("querySelector", ".fa-chart-bar");
  addSpinner(unitIcon);
  currentLocObjFrmCls.toggleUnit();
  updateDataAndDisplay(currentLocObjFrmCls);
}

// refreshing weather
function refreshWeather() {
  const refreshIcon = getElementFromDOM("querySelector", ".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLocObjFrmCls);
}

// submiting new location
async function submitNewLocation(event) {
  event.preventDefault();
  let userText = getElementFromDOM("id", "searchBar__text").value;
  userText = cleanText(userText);
  if (!userText.length) return;
  const searchIcon = getElementFromDOM("querySelector", ".fa-search");
  addSpinner(searchIcon);
  const coordsData = await getCoordsFrmAPI(userText, currentLocObjFrmCls.unit);
  if (coordsData) {
    if (coordsData.response.status === 200) {
      const coordsObj = {
        lat: coordsData.weatherData.latitude,
        lon: coordsData.weatherData.longitude,
        name: coordsData.weatherData.resolvedAddress
          ? `${coordsData.weatherData.resolvedAddress}`
          : `Lat ${coordsData.weatherData.latitude} Lon${coordsData.weatherData.longitude}`,
      };
      setLocationObj(currentLocObjFrmCls, coordsObj);
      updateDataAndDisplay(currentLocObjFrmCls);
    } else {
      displayApiErrror(coordsData.response.statusText);
    }
  } else {
    displayError("Connnection Error", "Connection Error");
  }

  /*   const APIKey = `31eb3e7c412e0cadc4c4669b71f5f9cf`;
  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${userText}&appid=${APIKey}&units=metric`
  );
  console.log(weather.json()); */
}

// updateing data and display

async function updateDataAndDisplay(currentLocObjFrmCls) {
  console.log("Updating data and display", currentLocObjFrmCls);

  const coordsData = await getWeatherFromCoords(currentLocObjFrmCls);
  console.log(
    "Got weather json from api with lat and lon",
    coordsData.weatherData
  );
  if (coordsData.weatherData) {
    updateDisplay(coordsData.weatherData, currentLocObjFrmCls);
  }
}

/* prototype
promiseState: "fulfilled"
promiseResult: object
base: "stations";
 clouds:
  all: 20
  prototype: object
  cod: 200 // sucess or failure means 404
  coord:
   lat: 19.233
   lon: 72.22
   prototype: object
   dt: 1234332
   id: 1274
   main:
    feels_like: 28.76
    grnd_level: 1011
    humidity: 69
    pressure: 1011
    temp: 26.20
    temp_max: 26.90
    temp_min: 25.94
    prototype: object
    name: "Mumbai"
    sys:
     country: "IN"
     id: 9052
     sunrise: 1729991207
     sunset: 1298838
     type: 1
     prototype: object
     timezone: 19800
     visibility: 1700
     weather: Array(1)
     0: 
      description: "haze"
      icon: "50d"
      id: 2433
      main: "haze"
      prototype: object
      wind:
       deg: 90
       speed: 2.05
       prototype: object
      prototype: object
   
   */
/* if failed
  prototype
promiseState: "fulfilled"
promiseResult: object
 cod: "404"
 message: "city not founcd"
*/
