import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ResultsTable } from '../../competitor-pages/view-results/view-results.component';
import { Competition } from '../../models/competition';
import { Category } from '../../models/category';
import { ResultsService } from '../../services/results.service';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../../popups/snackbar-content/snackbar-content.component';
import { Entry } from '../../models/entry';
import { ConfirmModalComponent } from '../../popups/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { County } from '../../models/County';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-manage-results',
  templateUrl: './manage-results.component.html',
  styleUrls: ['./manage-results.component.css']
})
export class ManageResultsComponent implements OnInit {
  countyControl = new UntypedFormControl('', [Validators.required]);
  categoryControl = new UntypedFormControl('', [Validators.required]);
  selectFormControl = new UntypedFormControl('', Validators.required);
  county: County;
  category: Category;
  competition: Competition;
  counties: County[];
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
  fourthPlace: Entry;
  fifthPlace: Entry;
  manageResults = false;
  displayedColumns: string[] = ['place', 'name', 'branch'];
  dataSource = new MatTableDataSource<Object>(this.results);
  isLoggedIn = false;
  isLoginCheckDone = false;
  isComhraGaeilge = false;
  isSaveDisabled = true;
  loadComplete = false;
  subscription: Subscription;

  @ViewChild('catRef') catRef: MatSelect;
  compareEntry = UtilsService.compareEntry;
  compareCounty = UtilsService.compareCounty;

  constructor(
    private service: ResultsService,
    public router: Router,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private login: LoginService
  ) { }

  ngOnInit() {
    this.categories = [];
    this.competitions = [];
    this.results = [];
    this.names = [];
    this.initializeMap();
    this.subscription = this.login.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res.isLoggedIn;
      this.isLoginCheckDone = true;
      if (this.isLoggedIn) {
        this.service.getAllCountyNames()
          .then((res: County[]) => {
            this.counties = res;
            this.counties.sort((a, b) => a.county_name > b.county_name ? 1 : -1)
            this.county = UtilsService.getCountyFromLocalStorage(this.counties);
            if (this.county !== null && this.county !== undefined) {
              this.changeCounty(this.county, true);
            } else {
              this.loadComplete = true;
            }
          });
      } else {
        this.loadComplete = true;
      }
    });
  }

  changeCounty(county, loadScreen) {
    this.county = county;
    localStorage.setItem('selectedCounty', this.county.county_name);
    this.initializeTable();
    this.competition = null;
    this.category = null;
    if (this.catRef) this.catRef.options.forEach((el) => el.deselect());
    if (!this.categories || this.categories.length === 0) {
      this.service.getAllCategories()
        .then((res) => {
          this.categories = res;
          this.categories.sort((a, b) => a.category > b.category ? 1 : -1);
          if (loadScreen) this.loadComplete = true;
        });
    }
  }

  changeCategory(cat) {
    this.initializeTable();
    this.initializeMap();
    this.showResultsError = false;
    this.showNoResultsMsg = false;
    this.competition = null;
    this.manageResults = false;
    this.category = cat;
    if (this.category) this.service.getCompetitionByAgeGroup(this.category.id)
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
    this.isComhraGaeilge = this.competition.comp_type === 6;
  }

  placeSelected(name: Entry, place: string) {
    this.duplicatedResults = false;
    this.winners.set(place, name);
    this.isSaveDisabled = false;
    let valueFound = false;
    this.winners.forEach((val) => {
      if (val !== null) valueFound = true;
    });
    this.isSaveDisabled = !valueFound;
  }

  saveResults() {
    const params = {
      competition: this.competition.id,
      first: this.getEntrantIdCheckIfNull(this.winners.get('1')),
      second: this.getEntrantIdCheckIfNull(this.winners.get('2')),
      third: this.getEntrantIdCheckIfNull(this.winners.get('3')),
      fourth: this.getEntrantIdCheckIfNull(this.winners.get('4')),
      fifth: this.getEntrantIdCheckIfNull(this.winners.get('5')),
      recommended: this.getRecommended(),
      county: this.county.id
    }
    if (this.areResultsUnique()) {
      this.service.saveResults(params)
        .then((res) => {
          this.openSnackbar('green-snackbar', 'Results saved successful');
          this.manageResults = false;
          this.results = [];
          this.searchResults();
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
    this.winners.set('4', null);
    this.winners.set('5', null);
    this.firstPlace = null;
    this.secondPlace = null;
    this.thirdPlace = null;
    this.fourthPlace = null;
    this.fifthPlace = null;
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
    this.service.getNames(this.competition.id, this.county.id)
      .then((res: Entry[]) => {
        this.names = res;
        this.names.sort((a, b) => a.entrantName > b.entrantName ? 1 : -1);
        this.service.getResults(this.competition.id, this.county.id)
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

    const fourth = compResults.find((el) => el.place === '4' || el.place === '4 R');
    if (fourth) this.fourthPlace = this.names.find((entry) => entry.entrantName === fourth.name);
    if (this.fourthPlace) {
      this.winners.set('4', this.fourthPlace);
      if (fourth.place.includes('R')) this.isRecommended = true;
    }

    const fifth = compResults.find((el) => el.place === '5' || el.place === '5 R');
    if (fifth) this.fifthPlace = this.names.find((entry) => entry.entrantName === fifth.name);
    if (this.fifthPlace) {
      this.winners.set('5', this.fifthPlace);
      if (fifth.place.includes('R')) this.isRecommended = true;
    }
  }

  openEditMode() {
    this.showResults = false;
    this.showResultsError = false;
    this.showNoResultsMsg = false;
    this.manageResults = true;
    this.isComhraGaeilge = this.competition.comp_type === 6;
  }

  deleteResultForComp() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '750px',
      height: '200px',
      data: {
        title: 'Confirm Delete',
        ageGroup: this.category.age_group,
        competition: this.competition.competition_name,
        isDelete: true,
        county: this.county.county_name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteResult(this.competition.id, this.county.id)
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

    if (this.winners.get("5") !== null) {
      return this.getEntrantIdCheckIfNull(this.winners.get('5'));
    } else if (this.winners.get("4") !== null) {
      return this.getEntrantIdCheckIfNull(this.winners.get('4'));
    } else if (this.winners.get("3") !== null) {
      return this.getEntrantIdCheckIfNull(this.winners.get('3'));
    } else {
      return this.getEntrantIdCheckIfNull(this.winners.get('2'));
    }
  }

  private getEntrantIdCheckIfNull(entry: Entry) {
    if (entry === null || entry === undefined) {
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
          && values[i] !== null && values[y] !== null) {
          return false;
        }
      }
    }
    return true;
  }
}