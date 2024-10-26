export class CurrentLocation {
  constructor() {
    this._name = "Current Location";
    this._lat = null;
    this._lon = null;
    this._unit = "Imperial";
  }
  get name() {
    return this._name;
  }
  set name(newName) {
    this._name = newName;
  }
  get lat() {
    return this._lat;
  }
  set lat(newLat) {
    this._lat = newLat;
  }
  get lon() {
    return this._lon;
  }
  set lon(newLon) {
    this._lon = newLon;
  }
  get unit() {
    return this._unit;
  }
  set unit(newUnit) {
    this._unit = newUnit;
  }
  toggleUnit() {
    this._unit = this._unit === "Imperial" ? "metric" : "Imperial";
  }
}
