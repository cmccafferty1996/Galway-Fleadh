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

@Injectable({
  providedIn: 'root'
})
export class SlipsService {

  constructor(private http: HttpClient) { }

  getAllCountyNames() {
    return this.http.get('https://localhost:44372/api/comhaltas/counties').toPromise()
      .then((counties: County[]) => {
        return counties;
      });
  }

  getBranchesByCounty(county: number) {
    return this.http.get(`https://localhost:44372/api/comhaltas/branches?county=${county}`).toPromise()
      .then((branches: Branch[]) => {
        return branches;
      });
  }

  getAllCategories() {
    return this.http.get('https://localhost:44372/api/comhaltas/age-groups').toPromise()
      .then((res: Category[]) => {
        return res;
      });
  }

  getVenueLocation(county: number) {
    return this.http.get(`https://localhost:44372/api/comhaltas/location?county=${county}`).toPromise()
      .then((res: VenueLocation[]) => {
        return res;
      });
  }

  getCompetitionsByAgeGroup(age) {
    return this.http.get(`https://localhost:44372/api/comhaltas/competitions?age=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getCompetitionsByEntrant(entrantIds, slipType) {
    return this.http.post(`https://localhost:44372/api/comhaltas/slip-competitions/${slipType}`, entrantIds).toPromise()
      .then((res: SlipComp[]) => {
        return res;
      });
  }

  getEntrantsByBranch(branch) {
    return this.http.get(`https://localhost:44372/api/comhaltas/entrants?branch=${branch}`).toPromise()
      .then((res: Entrant[]) => {
        return res;
      });
  }

  getSlipsByType(comp, county, type) {
    return this.http.get(`https://localhost:44372/api/comhaltas/slips?comp=${comp}&county=${county}&slipType=${type}`)
      .toPromise().then((res: Slip[]) => {
        return res;
      });
  }

  createSlips(slips: Slip[]) {
    return this.http.post('https://localhost:44372/api/comhaltas/add-slips', slips).toPromise();
  }

  createSlipGroup(branch: number, competition: number, slipId: number) {
    return this.http.get(
      `https://localhost:44372/api/comhaltas/add-slip-group?branch=${branch}&competition=${competition}&slipId=${slipId}`
    ).toPromise();
  }

  getSlipGroups(slipId: number) {
    return this.http.get(`https://localhost:44372/api/comhaltas/slip-groups?slipId=${slipId}`).toPromise()
      .then((res: SlipComp[]) => {
        return res;
      });
  }
}