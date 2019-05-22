import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
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
  dataSource = new MatTableDataSource<String>(DATA);

  constructor(private http: HttpClient) { }

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

const DATA: String[] = ['U12 -Fiddle', 'Ceili Band'];
