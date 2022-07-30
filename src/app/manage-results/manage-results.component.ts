import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ResultsTable } from '../view-results/view-results.component';
import { Competition } from '../models/competition';
import { Category } from '../models/category';
import { ResultsService } from '../services/results.service';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../snackbar-content/snackbar-content.component';
import { Entry } from '../models/entry';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

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
  duplicatedResults = false;
  showResultsError = false;
  showNoResultsMsg = false;
  isRecommended = false;
  isLoading = false;
  results: ResultsTable[] = [];
  winners: Map<String, Entry> = new Map<String, Entry>();
  firstPlace: Entry;
  secondPlace: Entry;
  thirdPlace: Entry;
  manageResults = false;
  displayedColumns: string[] = ['place', 'name', 'branch'];
  dataSource = new MatTableDataSource<Object>(this.results);

  constructor(
    private service: ResultsService,
    public router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog
  ) { }

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
    this.showResultsError = false;
    this.showNoResultsMsg = false;
    this.competition = null;
    this.manageResults = false;
    this.category = cat;
    this.service.getCompetitionByAgeGroup(this.category.id)
    .then((res) => {
      this.competitions = res;
      this.competitions.sort((a, b) => a.competition_number > b.competition_number ? 1 : -1);
    });
  }

  changeCompetition(comp) {
    this.initializeTable();
    this.initializeMap();
    this.manageResults = false;
    this.competition = comp;
  }

  placeSelected(name: Entry, place: string) {
    this.duplicatedResults = false;
    this.winners.set(place, name);
  }

  saveResults() {
    const params = {
      competition: this.competition.id,
      first: this.getEntrantIdCheckIfNull(this.winners.get('1')),
      second: this.getEntrantIdCheckIfNull(this.winners.get('2')),
      third: this.getEntrantIdCheckIfNull(this.winners.get('3')),
      recommended: this.getRecommended(),
    }
    if (this.areResultsUnique()) {
      this.service.saveResults(params)
        .then((res) => {
          this.openSnackbar('green-snackbar', 'Results saved successful');
          this.manageResults = false;
          this.results = [];
        })
        .catch((err) => {
          console.log('Theres an error', err);
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
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [css]
    });
  }

  initializeTable() {
    this.showResults = false;
    this.results = [];
  }

  initializeMap() {
    this.winners.set('1', null);
    this.winners.set('2', null);
    this.winners.set('3', null);
    this.firstPlace = null;
    this.secondPlace = null;
    this.thirdPlace = null;
  }

  searchResults() {
    if (this.results.length > 0) return;
    this.isLoading = true;
    this.names = [];
    this.showResults = false;
    this.showResultsError = false;
    this.showNoResultsMsg = false;
    this.manageResults = false;
    this.initializeMap();
    this.results = [];
    this.isRecommended = false;
    this.service.getNames(this.competition.id)
      .then((res: Entry[]) => {
        this.names = res;
        this.names.sort((a, b) => a.entrantName > b.entrantName ? 1 : -1);
        this.service.getResultsByCompetition(this.competition.id)
          .then((res2: ResultsTable[]) => {
            this.prepopulateResults(res2);
            res2.forEach((winner) => {
              this.results.push(winner);
            });
            this.dataSource = new MatTableDataSource<ResultsTable>(this.results);
            this.showResults = true;
            this.isLoading = false;
            window.scrollTo(0, document.body.scrollHeight);
          })
          .catch((err) => {
            if (err.status === 404) {
              this.showResultsError = false;
              this.showNoResultsMsg = true;
            } else {
              this.showResultsError = true;
              this.showNoResultsMsg = false;
            }
            this.isLoading = false;
          });
      })
      .catch((err) => {
        this.isLoading = false;
        this.showResultsError = true;
      });
  }

  prepopulateResults(compResults: ResultsTable[]) {
    const first = compResults.find((el) => el.place === '1');
    if (first) this.firstPlace = this.names.find((entry) => entry.entrantName === first.name);
    if (this.firstPlace) this.winners.set('1', this.firstPlace);

    const second = compResults.find((el) => el.place === '2 R' || el.place === '2');
    if (second) this.secondPlace = this.names.find((entry) => entry.entrantName === second.name);
    if (this.secondPlace) {
      this.winners.set('2', this.secondPlace);
      if (second.place.includes('R')) this.isRecommended = true;
    }

    const third = compResults.find((el) => el.place === '3' || el.place === '3 R');
    if (third) this.thirdPlace = this.names.find((entry) => entry.entrantName === third.name);
    if (this.thirdPlace) {
      this.winners.set('3', this.thirdPlace);
      if (third.place.includes('R')) this.isRecommended = true;
    }
  }

  openEditMode() {
    this.showResults = false;
    this.showResultsError = false;
    this.showNoResultsMsg = false;
    this.manageResults = true;
  }

  deleteResultForComp() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '750px',
      height: '200px',
      data: {
        title: 'Confirm Delete',
        ageGroup: this.category.age_group,
        competition: this.competition.competition_name,
        isDelete: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteResult(this.competition.id)
        .then((message) => {
          this.manageResults = false;
          this.showResults = false;
          this.results = [];
          this.openSnackbar('green-snackbar', message);
        })
        .catch((err) => {
          if (err.status === 404 || err.status === 400) {
            this.openSnackbar('red-snackbar', err.error.Message);
          } else {
            this.openSnackbar('red-snackbar', 'Unknown error deleting the results.');
          }
        });
      }
    });
  }

  private getRecommended() {
    if (!this.isRecommended || this.names.length < 2) return null;
    if (this.winners.get("3") === null) {
      return this.getEntrantIdCheckIfNull(this.winners.get('2'));
    } else {
      return this.getEntrantIdCheckIfNull(this.winners.get('3'));
    }
  }

  private getEntrantIdCheckIfNull(entry: Entry) {
    if (entry === null) {
      return 0;
    } else {
      return entry.id;
    }
  }

  private areResultsUnique() {
    let i, y;
    let values = Array.from(this.winners.values());
    for (i=0; i < values.length - 1; i++) {
      for (y=i + 1; y < values.length; y++) {
        if ((this.getEntrantIdCheckIfNull(values[i]) === this.getEntrantIdCheckIfNull(values[y]))
          && values[i] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  compareEntry(e1: Entry, e2: Entry): boolean {
    if (e1 === undefined || e2 === undefined) return false;
    return e1.id === e2.id;
  }
}