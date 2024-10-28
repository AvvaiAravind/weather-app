import { formatDate, addDays } from "date-fns";

const APIKey = `GQ5YH8BGSNVQ7HJUZ4L8PDQC9`;

export function setLocationObj(currentLocObjFrmClas, liveLocationObj) {
  const { lat, lon, name, unit } = liveLocationObj;

  currentLocObjFrmClas.lat = lat;
  currentLocObjFrmClas.lon = lon;
  currentLocObjFrmClas.name = name;
  if (unit) {
    currentLocObjFrmClas.unit = unit;
  }
}

export function getHomeLocation() {
  return localStorage.getItem("savedLocation");
}

export async function getWeatherFromCoords(locationObj) {
  const lat = locationObj.lat;
  const lon = locationObj.lon;
  const unit = locationObj.unit;
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=${unit}&key=${APIKey}&include=current,daily&nocache=${Date.now()}`;
  try {
    const response = await fetch(url);
    const weatherData = await response.json();
    return {
      response,
      weatherData,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function getCoordsFrmAPI(entryText, unit) {
  const regex = /^\d+$/g;
  const flag = regex.test(entryText) ? "zip" : "q";

  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${entryText}?unitGroup=${unit}&key=${APIKey}&include=current,daily&nocache=${Date.now()}`;
  url = encodeURI(url);
  try {
    const response = await fetch(url);
    const weatherData = await response.json();

    return {
      response,
      weatherData,
    };
  } catch (error) {}
}
export function cleanText(text) {
  const regex = / {2,}/g;
  const cleanedText = text.replaceAll(regex, " ").trim();
  return cleanedText;
}
