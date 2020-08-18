import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Competition } from '../models/competition';
import { Category } from '../models/category';
import { ResultsTable } from '../view-results/view-results.component';
import { Entry } from '../models/entry';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) { }

  getAllCategories() {
    return this.http.get('https://localhost:44372/api/comhaltas/age-groups').toPromise()
      .then((res: Category[]) => {
        return res;
      });
  }

  getNames(comp) {
    return this.http.get(`https://localhost:44372/api/comhaltas/entries?comp=${comp}`).toPromise()
      .then((res: Entry[]) => {
        return res;
      });
  }
  
  getCompetitionByAgeGroup(age) {
    return this.http.get(`https://localhost:44372/api/comhaltas/competitions?age=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getResultsByCompetition(comp) {
    return this.http.get(`https://localhost:44372/api/comhaltas/results?comp=${comp}`).toPromise()
      .then((res: ResultsTable[]) => {
        return res;
      });
  }

  saveResults(results) {
    return this.http.put('https://localhost:44372/api/comhaltas/update-results', results, 
      {responseType: 'text'}).toPromise()
        .then((res) => console.log(res));
  }
}
