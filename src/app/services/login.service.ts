import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isLoggedInValue = false;
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedIn.asObservable();

  constructor() { }

  updateLoginState(state) {
    this.isLoggedInValue = state;
    this.isLoggedIn.next(this.isLoggedInValue);
  }
}
