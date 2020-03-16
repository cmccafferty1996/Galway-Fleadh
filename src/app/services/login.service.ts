import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class subjectData {
  isLoggedIn: boolean;
  user: string;

  constructor(loggedIn: boolean, u: string) {
    this.isLoggedIn = loggedIn;
    this.user = u;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isLoggedInValue = new subjectData(false, "");
  private isLoggedIn: BehaviorSubject<subjectData> = new BehaviorSubject<subjectData>(this.isLoggedInValue);
  isLoggedIn$: Observable<subjectData> = this.isLoggedIn.asObservable();

  constructor(private http: HttpClient) { }

  updateLoginState(state, userName) {
    this.isLoggedInValue.isLoggedIn = state;
    this.isLoggedInValue.user = userName;
    this.isLoggedIn.next(this.isLoggedInValue);
  }

  getUserByUserName(username) {
    return this.http.get(`http://galwayfleadh.ie:49372/controller/admin-user?username=${username}`).toPromise();
  }

  updateLastLogon(user) {
    return this.http.get(`http://galwayfleadh.ie:49372/controller/update-logon?username=${user}`,
      {responseType: 'text'}).toPromise();
  }
}
