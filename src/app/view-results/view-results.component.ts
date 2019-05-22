import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.css']
})
export class ViewResultsComponent implements OnInit {

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
  catagories: string[] = ['U9', 'U12', 'U15', 'U18',
   'Senior', 'duet', 'Grupa Ceol', 'Ceili band'];
  today = new Date();
  showResults = false;
  displayedColumns: string[] = ['place', 'name', 'branch'];
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

  onSubmit() {
    this.showResults = true;
  }
}

const DATA: Object[] = [
  {place: 1, name: 'Sean', branch: 'Cork CCE'},
  {place: 2, name: 'Jack', branch: 'Sligo CCE'},
  {place: 3, name: 'Sarah', branch: 'Dublin CCE'},
  {place: 'R', name: 'Lily', branch: 'Galway CCE'}];