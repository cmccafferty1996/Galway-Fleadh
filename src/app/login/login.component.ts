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
      this.isLoggedIn = res.isLoggedIn;
    });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  onSubmit() {
    this.login.getUserByUserName(this.username)
      .then((pass : string) => {
        if (pass === null) {
          this.loginFailed = true;
        } else {
          const passwordDecoded = atob(pass);
          const start = passwordDecoded.substring(0, 2);
          const end = passwordDecoded.substr(-2, 2);
          const middle = passwordDecoded.substr(2, passwordDecoded.length - 4);
          const finalPassword = end+middle+start;
          if (this.password !== finalPassword) {
            this.loginFailed = true;
          } else {
            this.login.updateLoginState(true, this.username);
            this.loginFailed = false;
            this.login.updateLastLogon(this.username);
          }
        }
      })
      .catch((err) => {
        this.loginFailed = true;
        console.log('Login error:', err);
      });
  }
}
