import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { ResultsTable } from '../view-results/view-results.component';
import { Competition } from '../models/competition';
import { Category } from '../models/category';
import { ResultsService } from '../services/results.service';
import { Entrant } from '../models/entrant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-results',
  templateUrl: './manage-results.component.html',
  styleUrls: ['./manage-results.component.css']
})
export class ManageResultsComponent implements OnInit {
  
  categoryControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  category: Category;
  competition: Competition;
  categories: Category[];
  competitions: Competition[];
  names: Entrant[];
  today = new Date();
  showResults = false;
  onSubmitClicked = false;
  results: ResultsTable[];
  winners: Map<String, Entrant> = new Map<String, Entrant>();
  manageResults = false;
  displayedColumns: string[] = ['name', 'branch', 'place'];
  dataSource = new MatTableDataSource<Object>(this.results);

  constructor(private service: ResultsService, private router: Router) { }

  ngOnInit() {
    this.categories = [];
    this.competitions = [];
    this.results = [];
    this.names = [];
    this.initializeMap();
    this.service.getAllCategories()
      .then((res: Category[]) => this.categories = res);
  }

  changeCategory(cat) {
    this.initializeTable();
    this.initializeMap();
    this.manageResults = false;
    this.category = cat;
    this.service.getCompetitionByAgeGroup(this.category.id)
    .then((res) => this.competitions = res);
  }

  changeCompetition(comp) {
    this.initializeTable();
    this.initializeMap();
    this.manageResults = false;
    this.competition = comp;
    this.service.getNames(this.competition.id)
      .then((res: Entrant[]) => this.names = res);
  }

  // changePlace(musician, place) {
  //   if (this.winners.get(musician)) {
  //     // handle change
  //   } else {
  //     this.winners.set(musician, place);
  //     const oldPlace = this.places.indexOf(place);
  //     this.places.splice(oldPlace, 1);
  //     console.log(this.winners);
  //   }
  // }

  placeSelected(name, place) {
    this.winners.set(place, name);
  }

  onSubmit() {
    if (this.results.length > 0) return;
    this.onSubmitClicked = true;
    this.manageResults = false;
    this.showResults = false;
    this.service.getResultsByCompetition(this.competition.id)
      .then((res: ResultsTable[]) => {
        res.forEach((winner) => {
          this.results.push(winner);
        });
        this.dataSource = new MatTableDataSource<ResultsTable>(this.results);
        this.showResults = true;
      });
  }

  saveResults() {
    const params = {
      competition: this.competition.id,
      first: this.getEntrantIdCheckIfNull(this.winners.get("1")),
      second: this.getEntrantIdCheckIfNull(this.winners.get("2")),
      third: this.getEntrantIdCheckIfNull(this.winners.get("3")),
      recommended: this.getEntrantIdCheckIfNull(this.winners.get("R")),
    }
    this.service.saveResults(params);
  }

  initializeTable() {
    this.showResults = false;
    this.onSubmitClicked = false;
    this.results = [];
  }

  initializeMap() {
    this.winners.set('1', null);
    this.winners.set('2', null);
    this.winners.set('3', null);
    this.winners.set('R', null);
  }

  inputResults() {
    this.manageResults = true;
    this.showResults = false;
    this.results = [];
  }

  private getEntrantIdCheckIfNull(entrant: Entrant) {
    if (entrant === null) {
      return null;
    } else {
      return entrant.id;
    }
  }
}