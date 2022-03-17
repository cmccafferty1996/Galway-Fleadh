export class VenueLocation {

  latitude: number;
  longitude: number;
  distance: number;

  public VenueLocation(lat: number, lon: number, dis: number) {
    this.latitude = lat;
    this.longitude = lon;
    this.distance = dis;
  }
}