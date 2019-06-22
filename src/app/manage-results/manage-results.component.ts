import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-manage-results',
  templateUrl: './manage-results.component.html',
  styleUrls: ['./manage-results.component.css']
})
export class ManageResultsComponent implements OnInit {
  
  categoryControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  category;
  competition;
  animals: Object[] = [
    {name: 'Dog'},
    {name: 'Cat'},
    {name: 'Cow'},
    {name: 'Fox'},
  ];
  catagories: string[] = [
    'U9', 'U12', 'U15', 'U18',
   'Senior', 'duet', 'Grupa Ceol', 'Ceili band'
  ];
  places: string[] = ['1', '2', '3', 'R'];
  names: string[] = [
    'Sean', 'Jack', 'Mary', 'John', 'Lily', 'Pat', 'Sarah'
  ];
  winners: Map<String, String> = new Map<String, String>();
  today = new Date();
  showResults = false;
  manageResults = false;
  displayedColumns: string[] = ['name', 'branch', 'place'];
  dataSource = new MatTableDataSource<Object>(DATA);

  constructor() { }

  ngOnInit() {
  }

  changeCategory(cat) {
    this.category = cat;
  }

  changeCompetition(comp) {
    this.competition = comp;
  }

  changePlace(musician, place) {
    if (this.winners.get(musician)) {
      // handle change
    } else {
      this.winners.set(musician, place);
      const oldPlace = this.places.indexOf(place);
      this.places.splice(oldPlace, 1);
      console.log(this.winners);
    }
  }

  placeSelected(name, place) {
    const index = this.names.indexOf(name);
    if (this.winners.get(name)) {
      console.log(this.winners.get(name));
    } else {
      this.winners.set(name, place);
      if (index) {
        this.names.splice(index, 1);
      } 
      console.log(this.winners);
    }
  }

  onSubmit() {
    this.showResults = true;
    this.manageResults = false;
  }

  inputResults() {
    this.manageResults = true;
    this.showResults = false;
  }
}

const DATA: Object[] = [
  {place: 1, name: 'Sean', branch: 'Cork CCE'},
  {place: 2, name: 'Jack', branch: 'Sligo CCE'},
  {place: 3, name: 'Sarah', branch: 'Dublin CCE'},
  {place: 'R', name: 'Lily', branch: 'Galway CCE'}
];
