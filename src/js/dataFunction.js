export function setLocationObj(currentLocObjFrmClas, liveLocationObj) {
  const { lat, lon, name, unit } = liveLocationObj;

  currentLocObjFrmClas.lat = lat;
  currentLocObjFrmClas.lon = lon;
  currentLocObjFrmClas.name = name;
  if (unit) {
    currentLocObjFrmClas.unit = unit;
  }
  console.log(
    "setted location to the currenLocation class",
    currentLocObjFrmClas
  );
  console.log("unit of the temperature", currentLocObjFrmClas.unit);
}

export function getHomeLocation() {
  return localStorage.getItem("savedLocation");
}

export function cleanText(text) {
  const regex = / {2,}/g;
  const cleanedText = text.replaceAll(regex, " ").trim();
  return cleanedText;
}
