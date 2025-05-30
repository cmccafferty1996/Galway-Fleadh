import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/branch';
import { Entrant } from '../models/entrant';
import { Category } from '../models/category';
import { Competition } from '../models/competition';
import { Entry } from '../models/entry';
import { VenueLocation } from '../models/venue-location';
import { County } from '../models/County';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

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

  getCompetitionByAgeGroup(age) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/competitions?age=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getEntries(comp, county) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/entries?comp=${comp}&county=${county}`).toPromise()
      .then((res: Entry[]) => {
        return res;
      });
  }

  getEntrantById(id) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/entrant?id=${id}`).toPromise()
      .then((res: Entrant) => {
        return res;
      });
  }

  saveEntries(entries) {
    return this.http.put(`${environment.baseUrl}/api/comhaltas/updateEntries`, entries,
      {responseType: 'text'}).toPromise();
  }
}
