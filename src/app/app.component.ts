import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FlaApp';
  navLinks: any[];
  activeLinkIndex = -1;
  isLoggedIn = false;
  subscription: Subscription;
  user: string;
  today: Date;
  year: number;

  constructor(private router: Router, private login: LoginService) {
  }

  ngOnInit(): void {
    this.user = "";
    this.today = new Date();
    this.year = this.today.getFullYear();
    this.subscription = this.login.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res.isLoggedIn;
      this.user = res.user;
      this.setNavLinks(res.isLoggedIn);
    });
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  logOut() {
    this.login.updateLoginState(false, "");
    this.router.navigate(['/home']);
  }

  setNavLinks(res) {
    if (res === true) {
      this.navLinks = [
        {
            label: 'Home',
            link: './home',
            icon: 'home',
            index: 0
        }, {
            label: 'Manage Registration',
            link: './manage-reg',
            icon: 'how_to_reg',
            index: 1
        }, {
            label: 'Manage Results',
            link: './manage-results',
            icon: 'event_note',
            index: 2
        }, {
          label: 'Manage Slips & Permits',
          link: './manage-slips',
          icon: 'description',
          index: 3
        }
      ];
    } else {
      this.navLinks = [
        {
            label: 'Home',
            link: './home',
            icon: 'home',
            index: 0
        }, {
            label: 'Register',
            link: './register',
            icon: 'how_to_reg',
            index: 1
        }, {
            label: 'View Results',
            link: './results',
            icon: 'event_note',
            index: 2
        }, {
            label: 'Slips & Permits',
            link: './slips',
            icon: 'description',
            index: 3
        }, {
            label: 'Login',
            link: './login',
            icon: 'perm_identity',
            index: 4
        }
      ];
    }
  }
}
