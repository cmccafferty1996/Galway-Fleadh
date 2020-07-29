import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/branch';
import { Entrant } from '../models/entrant';
import { Category } from '../models/category';
import { Competition } from '../models/competition';
import { Entry } from '../models/entry';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  getAllBranchNames() {
    return this.http.get('https://localhost:44372/api/comhaltas/branches').toPromise()
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

  getCompetitionByAgeGroup(age) {
    return this.http.get(`https://localhost:44372/api/comhaltas/competitions?age=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getEntries(comp) {
    return this.http.get(`https://localhost:44372/api/comhaltas/entries?comp=${comp}`).toPromise()
      .then((res: Entry[]) => {
        return res;
      });
  }

  getEntrantById(id) {
    return this.http.get(`https://localhost:44372/api/comhaltas/entrant?id=${id}`).toPromise()
      .then((res: Entrant) => {
        return res;
      });
  }

  saveEntries(entries) {
    return this.http.put('https://localhost:44372/api/comhaltas/updateEntries', entries,
      {responseType: 'text'}).toPromise();
  }
}
