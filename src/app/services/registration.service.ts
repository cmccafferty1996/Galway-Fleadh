import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/branch';
import { Entrant } from '../models/entrant';
import { Category } from '../models/category';
import { Competition } from '../models/competition';
import { Entries } from '../models/entries';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  getAllBranchNames() {
    return this.http.get('http://localhost:8080/controller/branches').toPromise()
      .then((branches: Branch[]) => {
        return branches;
      });
  }

  getAllCategories() {
    return this.http.get('http://localhost:8080/controller/age-groups').toPromise()
      .then((res: Category[]) => {
        return res;
      });
  }

  getCompetitionByAgeGroup(age) {
    return this.http.get(`http://localhost:8080/controller/competitions?AgeGroup=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getEntries(comp) {
    return this.http.get(`http://localhost:8080/controller/entries?comp=${comp}`).toPromise()
      .then((res: Entries[]) => {
        return res;
      });
  }

  getEntrantById(id) {
    return this.http.get(`http://localhost:8080/controller/entrant?id=${id}`).toPromise()
      .then((res: Entrant) => {
        return res;
      });
  }

  saveEntries(entries) {
    return this.http.put('http://localhost:8080/controller/updateEntries', entries,
      {responseType: 'text'}).toPromise();
  }
}
