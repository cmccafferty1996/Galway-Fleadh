import { Injectable } from "@angular/core";
import { Entry } from "../models/entry";
import { County } from "../models/County";
import { CoOrdinate } from "../competitor-pages/register/register.component";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {}

  public static compareEntry(e1: Entry, e2: Entry): boolean {
    if (e1 === undefined || e2 === undefined) return false;
    if (e1 === null || e2 === null) return false;
    return e1.id === e2.id;
  }

  public static compareCounty(c1: County, c2: County): boolean {
    if (c1 === undefined || c2 === undefined) return false;
    if (c1 === null || c2 === null) return false;
    return c1.county_name === c2.county_name;
  }

  public static getCountyFromLocalStorage(counties: County[]): County {
    const countyName = localStorage.getItem('selectedCounty');
    if (countyName === null || countyName === undefined) {
      return null;
    }
    return counties.find((c) => c.county_name === countyName);
  }

  public static isCompDateToday(compDate: Date, today: Date) {
    if (compDate === null || compDate === undefined) return true;
    const date = new Date(compDate);
    let result = false;
    if (today >= date) {
      result = true;
    }
    return result;
  }

  public static isUserAtTheVenue(venue: CoOrdinate, venueDistance: number): Promise<boolean> {
    if (!navigator && !navigator.geolocation) return Promise.resolve(true); // can't get location just return true
    if (venue === null || venueDistance === -1) return Promise.resolve(true); // parameters not set

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(position.coords.latitude - venue.latitude);
        const dLon = deg2rad(position.coords.longitude - venue.longitude);
  
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(position.coords.latitude)) * Math.cos(deg2rad(venue.latitude)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distance in km
        resolve(d < venueDistance);
      }, (err) => {
        reject(err);
      });
    });
  }
}

function deg2rad(latitude: number): number {
  return latitude * (Math.PI/180)
}
