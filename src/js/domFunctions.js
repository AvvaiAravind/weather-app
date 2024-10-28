import { da } from "date-fns/locale";
import {
  getElementFromDOM,
  createElementWithClass,
  appendElement,
} from "./utilityFunctions";
import { formatDate } from "date-fns";

export function setPlaceholderText() {
  const input = getElementFromDOM("id", "searchBar__text");
  input.placeholder =
    window.innerWidth <= 400
      ? "City, State, Country"
      : "City, State, Country or Zip Code";
}

export function addSpinner(element) {
  animateBtn(element);
  setTimeout(animateBtn, 1000, element);
}

function animateBtn(element) {
  element.classList.toggle("none");
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
}

export function displayError(headerMsg, screeaderMsg) {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderMsg(screeaderMsg);
}

export function displayApiErrror(statusMsg) {
  const properMsg = toProperCase(statusMsg.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderMsg(`${properMsg}, Please try again `);
}

function toProperCase(text) {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.chatAt(0).toUpperCase() + word.slice(i);
  });
  return properWords.join(" ");
}

export function updateWeatherLocationHeader(msg) {
  const h2 = getElementFromDOM("id", "currentForecast__location");
  if (msg.indexOf("Lat") !== -1 && msg.indexOf("Lon") !== -1) {
    const array = msg.split(" ");

    let latCoords = array[1].slice(0, 5);
    let lonCoords = array[4].slice(0, 5);
    h2.textContent = `${array[0]} ${latCoords} ${array[2]} ${array[3]} ${lonCoords}`;
  } else {
    h2.textContent = msg;
  }
}

export function updateScreenReaderMsg(msg) {
  const offScrMsg = getElementFromDOM("id", "confirmation");
  offScrMsg.textContent = msg;
}

export function updateDisplay(weatherDataFrmApi, currentLocObjFrmCls) {
  fadeDisplay();
  clearDisplay();
  const weatherIcon = getWeatherIcon(weatherDataFrmApi.currentConditions.icon);
  setBckGrndImg(weatherIcon);
  const screenReaderWeatherMsg = buildScreenReaderWeatherMsg(
    weatherDataFrmApi,
    currentLocObjFrmCls
  );
  const headerMsg = currentLocObjFrmCls.name;
  updateScreenReaderMsg(screenReaderWeatherMsg);
  updateWeatherLocationHeader(headerMsg);
  // current conditions
  createCurCondDiv(weatherDataFrmApi, currentLocObjFrmCls);
  // sixday weather forecast
  createSixDayForcast(weatherDataFrmApi, currentLocObjFrmCls);
  setFocusOnSearch();
  fadeDisplay();
}

function fadeDisplay() {
  const currentconditionSection = getElementFromDOM("id", "currentForecast");
  currentconditionSection.classList.toggle("zero-vis");
  currentconditionSection.classList.toggle("fad-in");
  const sixDaySection = getElementFromDOM("id", "dailyForecast");
  sixDaySection.classList.toggle("zero-vis");
  sixDaySection.classList.toggle("fade-in");
}

export function clearDisplay() {
  const currentConditionDiv = getElementFromDOM(
    "id",
    "currentForecast__conditions"
  );
  deleteContents(currentConditionDiv);
  const dailyForecastDiv = getElementFromDOM("id", "dailyForecast__contents");
  deleteContents(dailyForecastDiv);
}

function deleteContents(parent) {
  while (parent.firstElementChild) {
    parent.removeChild(parent.firstElementChild);
  }
}

function getWeatherIcon(icon) {
  let weatherIcon;
  if (
    icon === "clear-day" ||
    icon === "partly-cloudy-day" ||
    icon === "cloudy" ||
    icon === "wind"
  ) {
    weatherIcon = "clouds";
  } else if (
    icon === "clear-night" ||
    icon === "partly-cloudy-night" ||
    icon === "night"
  ) {
    weatherIcon = "night";
  } else if (
    icon === "rain" ||
    icon === "thunder-rain" ||
    icon === "thunder-showers-day" ||
    icon === "thunder-showers-night" ||
    icon === "showers-day" ||
    icon === "showers-night"
  ) {
    weatherIcon = "rain";
  } else if (icon === "fog") {
    weatherIcon = "fog";
  } else {
    weatherIcon = "snow";
  }
  return weatherIcon;
}

function setBckGrndImg(weatherIcon) {
  document.documentElement.classList.add(weatherIcon);

  document.documentElement.classList.forEach((className) => {
    if (className !== weatherIcon) {
      document.documentElement.classList.remove(className);
    }
  });
}

function buildScreenReaderWeatherMsg(weatherDataFrmApi, currentLocObjFrmCls) {
  const unit = currentLocObjFrmCls.unit;
  const name = currentLocObjFrmCls.name;
  const tempUnit = unit === "metric" ? "Degree Celsius" : "Degree farenhit";
  const conditions = weatherDataFrmApi.days[0].description;
  const temp = Math.round(Number(weatherDataFrmApi.currentConditions.temp));
  const message = `Current Condition in ${name} is ${conditions} and the temperature is ${temp}${tempUnit}`;
  return message;
}

function setFocusOnSearch() {
  const input = getElementFromDOM("id", "searchBar__text");
  input.focus();
  input.value = "";
}

function createCurCondDiv(weatherDataFrmApi, currentLocObjFrmCls) {
  const unit = currentLocObjFrmCls.unit;

  const temp = `${Math.round(
    Number(weatherDataFrmApi.currentConditions.temp)
  )}°`;
  const tempUnit = unit === "metric" ? "C" : "F";
  const desc = weatherDataFrmApi.days[0].description;
  const feels = `Feels Like ${weatherDataFrmApi.days[0].feelslike}°`;
  const maxtemp = `High ${weatherDataFrmApi.days[0].feelslikemax}°`;
  const mintemp = `Low ${weatherDataFrmApi.days[0].feelslikemin}°`;
  const humidity = `Humidity ${weatherDataFrmApi.currentConditions.humidity}%`;
  const windUnit = unit === "metric" ? "kph" : "mph";
  const wind = `Wind ${weatherDataFrmApi.currentConditions.windspeed} ${windUnit}`;
  const decidedIconClass = decideIcons(
    weatherDataFrmApi.currentConditions.icon
  );
  const iconDiv = createIconDiv(
    decidedIconClass,
    weatherDataFrmApi.currentConditions.icon
  );
  appendElement("#currentForecast__conditions", iconDiv);
  createElement("div", "temp", "#currentForecast__conditions", temp);
  createElement("div", "unit", ".temp", tempUnit);
  createElement("div", "desc", "#currentForecast__conditions", desc);
  createElement("div", "feels", "#currentForecast__conditions", feels);
  createElement("div", "maxtemp", "#currentForecast__conditions", maxtemp);
  createElement("div", "mintemp", "#currentForecast__conditions", mintemp);
  createElement("div", "humidity", "#currentForecast__conditions", humidity);
  createElement("div", "wind", "#currentForecast__conditions", wind);

  appendElement("#currentForecast__conditions", iconDiv);
}

function decideIcons(icon) {
  let iconClass;
  if (
    icon === "clear-day" ||
    icon === "partly-cloudy-day" ||
    icon === "cloudy"
  ) {
    iconClass = "fa-cloud-sun";
  } else if (icon === "clear-night" || icon === "partly-cloudy-night") {
    iconClass = "fa-cloud-moon";
  } else if (icon === "wind") {
    iconClass = "fa-wind";
  } else if (icon === "fog") {
    iconClass = "fa-smog";
  } else if (
    icon === "rain" ||
    icon === "thunder-rain" ||
    icon === "showers-day"
  ) {
    iconClass = "fa-cloud-rain";
  } else if (icon === "thunder-showers-night" || icon === "showers-night") {
    iconClass = "fa-cloud-moon-rain";
  } else if (
    icon === "snow" ||
    icon === "snow-showers-night" ||
    icon === "snow-showers-day"
  ) {
    iconClass = "fa-snowflake";
  }
  return iconClass;
}

function createIconDiv(className, iconName) {
  const div = createElementWithClass("div", "icon");
  div.id = "icon";
  const i = createElementWithClass("i", "fa-solid", className);
  i.ariaHidden = true;
  i.title = iconName;

  div.appendChild(i);

  return div;
}

function createElement(elementType, classname, parentElement, text) {
  const element = createElementWithClass(elementType, classname);
  element.textContent = text;
  appendElement(parentElement, element);
}

function createSixDayForcast(weatherDataFrmApi, currentLocObjFrmCls) {
  for (let i = 1; i <= 6; i++) {
    const forecastDay = createElementWithClass("div", "forecastDay");
    const dayAbbreviation = createElementWithClass("p", "dayAbbreviation");
    const dayHigh = createElementWithClass("p", "dayHigh");
    const dayLow = createElementWithClass("p", "dayLow");
    dayAbbreviation.textContent = formatDate(
      weatherDataFrmApi.days[i].datetime,
      "EEEE"
    ).slice(0, 3);
    const decidedIconClass = decideIcons(weatherDataFrmApi.days[i].icon);
    const icon = createElementWithClass("i", "fa-solid", decidedIconClass);
    dayHigh.textContent = weatherDataFrmApi.days[i].tempmax;
    dayLow.textContent = weatherDataFrmApi.days[i].tempmin;
    forecastDay.appendChild(dayAbbreviation);
    forecastDay.appendChild(icon);
    forecastDay.appendChild(dayHigh);
    forecastDay.appendChild(dayLow);
    appendElement("#dailyForecast__contents", forecastDay);
  }
}
