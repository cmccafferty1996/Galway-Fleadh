import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export class RowElement {
  name: string;
  isRegistered: boolean;
  isEditable: boolean;

  constructor(n: string, reg: boolean) {
    this.name = n;
    this.isRegistered = reg;
    this.isEditable = !reg;
  }
}

@Component({
  selector: 'app-manage-registration',
  templateUrl: './manage-registration.component.html',
  styleUrls: ['./manage-registration.component.css']
})
export class ManageRegistrationComponent implements OnInit {

  location: number[];
  branchControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  animals: Object[] = [
    {name: 'Dog'},
    {name: 'Cat'},
    {name: 'Cow'},
    {name: 'Fox'},
  ];
  branch;
  name;
  group;
  today = new Date();
  showCompetitions = false;
  displayedColumns: string[] = ['compition', 'registered'];
  dataSource = new MatTableDataSource<RowElement>(DATA);

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.location = [];
    this.getLocation();
  }

  getLocation() {
    console.log(navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.push(position.coords.latitude);
        this.location.push(position.coords.longitude);
      })
    }
  }

  changeBranch(branch) {
    this.branch = branch;
  }

  changeName(name) {
    this.name = name;
  }

  changeGroup(group) {
    this.group = group;
  }

  onSubmit() {
    this.showCompetitions = true;
  }
}

const DATA: RowElement[] = [
  new RowElement('U12 -Fiddle', true),
  new RowElement('Ceili Band', false)
];
