import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Competition } from "../models/competition";
import { VenueLocation } from "../models/venue-location";
import { Category } from "../models/category";
import { Branch } from "../models/branch";
import { County } from "../models/County";
import { Entrant } from "../models/entrant";
import { Slip } from "../models/Slip";
import { SlipComp } from "../models/SlipComp";
import { Entry } from "../models/entry";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SlipsService {

  constructor(private http: HttpClient) { }

  getAllCountyNames() {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/counties`).toPromise()
      .then((counties: County[]) => {
        return counties;
      });
  }

  getBranchesByCounty(county: number) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/branches?county=${county}`).toPromise()
      .then((branches: Branch[]) => {
        return branches;
      });
  }

  getAllCategories() {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/age-groups`).toPromise()
      .then((res: Category[]) => {
        return res;
      });
  }

  getVenueLocation(county: number) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/location?county=${county}`).toPromise()
      .then((res: VenueLocation[]) => {
        return res;
      });
  }

  getCompetitionsByAgeGroup(age) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/competitions?age=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getCompetitionsByEntrant(entrantIds, slipType) {
    return this.http.post(`${environment.baseUrl}/api/comhaltas/slip-competitions/${slipType}`, entrantIds).toPromise()
      .then((res: SlipComp[]) => {
        return res;
      });
  }

  checkSlipExists(entryIds, slipType) {
    return this.http.post(`${environment.baseUrl}/api/comhaltas/check-slip-exists/${slipType}`, entryIds).toPromise()
      .then((res: Slip[]) => {
        return res;
      });
  }

  getEntrantsByBranch(branch) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/entrants?branch=${branch}`).toPromise()
      .then((res: Entrant[]) => {
        return res;
      });
  }

  getEntries(comp, county) {
      return this.http.get(`${environment.baseUrl}/api/comhaltas/entries?comp=${comp}&county=${county}`).toPromise()
        .then((res: Entry[]) => {
          return res;
        });
    }

  getSlipsByType(comp, county, type) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/slips?comp=${comp}&county=${county}&slipType=${type}`)
      .toPromise().then((res: Slip[]) => {
        return res;
      });
  }

  createSlips(slips: Slip[]) {
    return this.http.post(`${environment.baseUrl}/api/comhaltas/add-slips`, slips).toPromise();
  }

  createSlipGroup(groupId: number, slipId: number) {
    return this.http.get(
      `${environment.baseUrl}/api/comhaltas/add-slip-group?groupEntry=${groupId}&slipId=${slipId}`
    ).toPromise();
  }

  getSlipGroups(slipId: number) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/slip-groups?slipId=${slipId}`).toPromise()
      .then((res: SlipComp[]) => {
        return res;
      });
  }
}