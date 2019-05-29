import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username;
  password;
  loginFailed = false;
  isLoggedIn = false;
  subscription: Subscription;

  constructor(private login: LoginService) { }

  ngOnInit() {
    this.username = '';
    this.password = '';
    this.subscription = this.login.isLoggedIn$.subscribe((res) => {
      console.log(res);
      this.isLoggedIn = res;
    });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  onSubmit() {
    console.log('here', this.username, this.password);
    if (this.username === 'admin' && this.password === 'donegal$1') {
      this.login.updateLoginState(true);
      this.loginFailed = false;
    } else {
      this.loginFailed = true;
    }
  }
}
