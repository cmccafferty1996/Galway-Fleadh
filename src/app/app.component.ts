import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FlaApp';
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private router: Router) {
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
      }, 
    ];
  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }
}
