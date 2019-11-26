import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Competition } from '../models/competition';
import { Entrant } from '../models/entrant';
import { Category } from '../models/category';
import { Branch } from '../models/branch';
import { ResultsTable } from '../view-results/view-results.component';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) { }

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

  getEntrantById(id) {
    return this.http.get(`http://localhost:8080/controller/entrant?id=${id}`).toPromise()
      .then((res: Entrant) => {
        return res;
      });
  }

  getBranchById(id) {
    return this.http.get(`http://localhost:8080/controller/branch?id=${id}`).toPromise()
      .then((branch: Branch) => {
        return branch;
      });
  }

  getResultsByCompetition(comp) {
    return this.http.get(`http://localhost:8080/controller/results?competition=${comp}`).toPromise()
      .then((res: ResultsTable[]) => {
        return res;
      });
  }
}
