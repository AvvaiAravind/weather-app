import { getElementFromDOM } from "./utilityFunctions";

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
  console.log("msg in header", msg);

  const h2 = getElementFromDOM("id", "currentForecast__location");
  h2.textContent = msg;
}

export function updateScreenReaderMsg(msg) {
  console.log("msg in screen reader", msg);

  const offScrMsg = getElementFromDOM("id", "confirmation");
  offScrMsg.textContent = msg;
}

export function updateDisplay(weatherDataFrmApi, currentLocObjFrmCls) {
  fadeDisplay();
  clearDisplay();

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

function clearDisplay() {
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
