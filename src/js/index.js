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
  clearDisplay,
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

  displayError(errMsg, errMsg);
}

// handle success for geoloaction

function geoSuccess(position) {
  const liveLocationObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat: ${position.coords.latitude} and Lon: ${position.coords.longitude}`,
  };

  setLocationObj(currentLocObjFrmCls, liveLocationObj);
  updateDataAndDisplay(currentLocObjFrmCls);
}

// loading weather

function loadWeather(event) {
  const savedLoc = getHomeLocation();
  if (!savedLoc && !event) {
    return getGeoWeather();
  } else if (!savedLoc && event.type === "click") {
    clearDisplay();
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
  if (currentLocObjFrmCls.lat !== null && currentLocObjFrmCls.lon !== null) {
    const saveIcon = getElementFromDOM("querySelector", ".fa-save");
    addSpinner(saveIcon);
    const currentLocObj = {
      lat: currentLocObjFrmCls.lat,
      lon: currentLocObjFrmCls.lon,
      name: currentLocObjFrmCls.name,
      unit: currentLocObjFrmCls.unit,
    };

    localStorage.setItem("savedLocation", JSON.stringify(currentLocObj));
    updateWeatherLocationHeader(`Current location is saved`);
    updateScreenReaderMsg("Current location is saved");
  } else {
    clearDisplay();
    displayError(
      "Enable to get location coordinates please ensure location is turned on",
      "Enable to get location coordinates please ensure location is turned on"
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
        name: coordsData.weatherData.address
          ? `${coordsData.weatherData.address}`
          : `Lat: ${coordsData.weatherData.latitude} Lon: ${coordsData.weatherData.longitude}`,
      };
      setLocationObj(currentLocObjFrmCls, coordsObj);
      updateDataAndDisplay(currentLocObjFrmCls);
    } else {
      clearDisplay();
      displayApiErrror(coordsData.response.statusText);
    }
  } else {
    clearDisplay();
    displayError("Connnection Error", "Connection Error");
  }
}

// updateing data and display

async function updateDataAndDisplay(currentLocObjFrmCls) {
  if (currentLocObjFrmCls.lat !== null && currentLocObjFrmCls.lon !== null) {
    const coordsData = await getWeatherFromCoords(currentLocObjFrmCls);

    if (coordsData) {
      if (coordsData.weatherData) {
        updateDisplay(coordsData.weatherData, currentLocObjFrmCls);
      } else {
        clearDisplay();
        displayApiErrror(coordsData.response.statusText);
      }
    } else {
      clearDisplay();
      displayError("Connnection Error", "Connection Error");
    }
  } else {
    clearDisplay();
    displayError(
      "Enable to get location coordinates please ensure location is turned on",
      "Enable to get location coordinates please ensure location is turned on"
    );
  }
}
