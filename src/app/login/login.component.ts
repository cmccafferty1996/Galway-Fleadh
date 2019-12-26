import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { AdminUser } from '../models/AdminUser';

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
      this.isLoggedIn = res.isLoggedIn;
    });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  onSubmit() {
    this.login.getUserByUserName(this.username)
      .then((user: AdminUser) => {
        if (user === null) {
          this.loginFailed = true;
        } else {
          if (this.password !== user.password) {
            this.loginFailed = true;
          } else {
            this.login.updateLoginState(true, this.username);
            this.loginFailed = false;
            this.login.updateLastLogon(user.userName);
          }
        }
      });
  }
}
