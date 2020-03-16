import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Competition } from '../models/competition';
import { Entrant } from '../models/entrant';
import { Category } from '../models/category';
import { ResultsTable } from '../view-results/view-results.component';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) { }

  getAllCategories() {
    return this.http.get('http://galwayfleadh.ie:49372/controller/age-groups').toPromise()
      .then((res: Category[]) => {
        return res;
      });
  }

  getNames(comp) {
    return this.http.get(`http://galwayfleadh.ie:49372/controller/entries-names?comp=${comp}`).toPromise()
      .then((res: Entrant[]) => {
        return res;
      });
  }
  
  getCompetitionByAgeGroup(age) {
    return this.http.get(`http://galwayfleadh.ie:49372/controller/competitions?AgeGroup=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getResultsByCompetition(comp) {
    return this.http.get(`http://galwayfleadh.ie:49372/controller/results?competition=${comp}`).toPromise()
      .then((res: ResultsTable[]) => {
        return res;
      });
  }

  saveResults(results) {
    return this.http.put('http://galwayfleadh.ie:49372/controller/update-results', results, 
      {responseType: 'text'}).toPromise()
        .then((res) => console.log(res));
  }
}
