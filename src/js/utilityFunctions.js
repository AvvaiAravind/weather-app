export function getElementFromDOM(selectorType, selector) {
  let element;
  if (!selectorType || !selector) {
    console.log("Please give selector and its type correctly");
    return null;
  } else if (selectorType === "id") {
    element = document.getElementById(selector);
  } else if (selectorType === "class") {
    element = document.getElementsByClassName(selector);
  } else if (selectorType === "tag") {
    element = document.getElementsByTagName(selector);
  } else if (selectorType === "querySelector") {
    element = document.querySelector(selector);
  } else if (selectorType === "querySelectorAll") {
    element = document.querySelectorAll(selector);
  } else {
    console.log("Invalid selector type provided. Please check your input. ");
    return null;
  }
  console.log(
    "Getting element from dom by function getElementFromDOM",
    element
  );

  return element;
}
