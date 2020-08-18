import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { ResultsTable } from '../view-results/view-results.component';
import { Competition } from '../models/competition';
import { Category } from '../models/category';
import { ResultsService } from '../services/results.service';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../snackbar-content/snackbar-content.component';
import { Entry } from '../models/entry';

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
  names: Entry[];
  today = new Date();
  showResults = false;
  onSubmitClicked = false;
  duplicatedResults = false;
  showResultsError = false;
  isRecommended = false;
  results: ResultsTable[];
  winners: Map<String, Entry> = new Map<String, Entry>();
  manageResults = false;
  displayedColumns: string[] = ['place', 'name', 'branch'];
  dataSource = new MatTableDataSource<Object>(this.results);

  constructor(private service: ResultsService, public router: Router, private snackbar: MatSnackBar) { }

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
    .then((res) => {
      this.competitions = res;
      this.competitions.sort((a, b) => a.competition_name > b.competition_name ? 1 : -1);
    });
  }

  changeCompetition(comp) {
    this.initializeTable();
    this.initializeMap();
    this.manageResults = false;
    this.competition = comp;
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
        window.scrollTo(0, document.body.scrollHeight);
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
      recommended: this.getRecommended(),
    }
    if (this.areResultsUnique()) {
      this.service.saveResults(params)
        .then((res) => {
          console.log(res);
          this.openSnackbar('green-snackbar', 'Results saved successful');
          this.manageResults = false;
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
  }

  inputResults() {
    if (this.manageResults == true) return;
    this.names = [];
    this.showResults = false;
    this.showResultsError = false;
    this.initializeMap();
    this.results = [];
    this.service.getNames(this.competition.id)
      .then((res: Entry[]) => {
        this.names = res;
        this.names.sort((a, b) => a.entrantName > b.entrantName ? 1 : -1);
        this.manageResults = true;
        window.scrollTo(0, document.body.scrollHeight);
      });
  }

  private getRecommended() {
    if (!this.isRecommended || this.names.length < 2) return null;
    if (this.winners.get("3") === null) {
      return this.getEntrantIdCheckIfNull(this.winners.get("2"));
    } else {
      return this.getEntrantIdCheckIfNull(this.winners.get("3"));
    }
  }

  private getEntrantIdCheckIfNull(entry: Entry) {
    if (entry === null) {
      return null;
    } else {
      return entry.id;
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