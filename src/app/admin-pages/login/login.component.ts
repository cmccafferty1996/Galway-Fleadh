import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';
import { AdminUser } from '../../models/AdminUser';

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
  isMissingInput = false;
  isIncorrectAccess = false;
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
    if (this.username === undefined || this.username ==='' || 
      this.password === undefined || this.password ==='') {
        this.loginFailed = false;
        this.isIncorrectAccess = false;
        this.isMissingInput = true;
        return;
    }
    this.isMissingInput = false;
    this.login.getUserByUserName(this.username)
      .then((user : AdminUser) => {
        if (user.password === null) {
          this.loginFailed = true;
        } else {
          const passwordDecoded = atob(user.password);
          const start = passwordDecoded.substring(0, 2);
          const end = passwordDecoded.substr(-2, 2);
          const middle = passwordDecoded.substr(2, passwordDecoded.length - 4);
          const finalPassword = end+middle+start;
          if (this.password !== finalPassword) {
            this.loginFailed = true;
            this.isIncorrectAccess = false;
          } else if (user.accessLevel < 2) {
            this.isIncorrectAccess = true;
            this.loginFailed = false;
          } else {
            this.login.updateLoginState(true, user.first_name+" "+user.surname);
            this.loginFailed = false;
            this.isIncorrectAccess = false;
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
