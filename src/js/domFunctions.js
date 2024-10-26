import { getElementFromDOM } from "./utilityFunctions";

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
