import { Injectable } from "@angular/core";
import { Entry } from "../models/entry";
import { County } from "../models/County";

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
    return c1.id === c2.id;
  }

  public static getCountyFromLocalStorage(): County {
    const countyAsString = localStorage.getItem('selectedCounty');
    const storedCounty = JSON.parse(countyAsString) as County;
    return storedCounty;
  }
}