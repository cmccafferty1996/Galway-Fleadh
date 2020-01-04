import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { ResultsTable } from '../view-results/view-results.component';
import { Competition } from '../models/competition';
import { Category } from '../models/category';
import { ResultsService } from '../services/results.service';
import { Entrant } from '../models/entrant';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../snackbar-content/snackbar-content.component';

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
  duplicatedResults = false;
  showResultsError = false;
  results: ResultsTable[];
  winners: Map<String, Entrant> = new Map<String, Entrant>();
  manageResults = false;
  displayedColumns: string[] = ['name', 'branch', 'place'];
  dataSource = new MatTableDataSource<Object>(this.results);

  constructor(private service: ResultsService, private router: Router, private snackbar: MatSnackBar) { }

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

  placeSelected(name, place) {
    this.duplicatedResults = false;
    this.winners.set(place, name);
  }

  onSubmit() {
    if (this.results.length > 0) return;
    this.onSubmitClicked = true;
    this.manageResults = false;
    this.showResults = false;
    this.showResultsError = false;
    this.service.getResultsByCompetition(this.competition.id)
      .then((res: ResultsTable[]) => {
        res.forEach((winner) => {
          this.results.push(winner);
        });
        this.dataSource = new MatTableDataSource<ResultsTable>(this.results);
        this.showResults = true;
      })
      .catch((err) => {
        this.showResultsError = true;
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
    if (this.areResultsUnique()) {
      this.service.saveResults(params)
        .then((res) => {
          console.log(res);
          this.openSnackbar('green-snackbar', 'Results saved successful');
        })
        .catch((err) => {
          console.log('theres an error', err);
          this.openSnackbar('red-snackbar', 'Error saving results');
        });
    } else {
      this.duplicatedResults = true;
    }
  }

  openSnackbar(css, message) {
    this.snackbar.openFromComponent(SnackbarContentComponent, {
      duration: 5000,
      data: {message},
      panelClass: [css]
    });
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
    this.showResultsError = false;
    this.results = [];
  }

  private getEntrantIdCheckIfNull(entrant: Entrant) {
    if (entrant === null) {
      return null;
    } else {
      return entrant.id;
    }
  }

  private areResultsUnique() {
    let i, y;
    let values = Array.from(this.winners.values());
    for (i=0; i < values.length - 1; i++) {
      for (y=i + 1; y < values.length; y++) {
        if (this.getEntrantIdCheckIfNull(values[i]) === this.getEntrantIdCheckIfNull(values[y])) {
          return false;
        }
      }
    }
    return true;
  }
}