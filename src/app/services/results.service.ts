import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Competition } from '../models/competition';
import { Category } from '../models/category';
import { ResultsTable } from '../competitor-pages/view-results/view-results.component';
import { Entry } from '../models/entry';
import { County } from '../models/County';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  constructor(private http: HttpClient) { }

  getAllCountyNames() {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/counties`).toPromise()
      .then((counties: County[]) => {
        return counties;
      });
  }

  getAllCategories() {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/age-groups`).toPromise()
      .then((res: Category[]) => {
        return res;
      });
  }

  getNames(comp, county) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/entries?comp=${comp}&county=${county}`).toPromise()
      .then((res: Entry[]) => {
        return res;
      });
  }
  
  getCompetitionByAgeGroup(age) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/competitions?age=${age}`).toPromise()
      .then((res: Competition[]) => {
        return res;
      });
  }

  getResults(comp, county) {
    return this.http.get(`${environment.baseUrl}/api/comhaltas/results?comp=${comp}&county=${county}`).toPromise()
      .then((res: ResultsTable[]) => {
        return res;
      });
  }

  saveResults(results) {
    return this.http.put(`${environment.baseUrl}/api/comhaltas/update-results`, results, 
      {responseType: 'text'}).toPromise()
        .then((res) => console.log(res));
  }

  deleteResult(comp, county) {
    return this.http.delete(`${environment.baseUrl}/api/comhaltas/delete-result?comp=${comp}&county=${county}`).toPromise()
    .then((res: string) => {
      return res;
    });
  }
}
