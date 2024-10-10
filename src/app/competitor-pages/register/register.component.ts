import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { RegistrationService } from '../../services/registration.service';
import { Branch } from '../../models/branch';
import { Entrant } from '../../models/entrant';
import { Category } from '../../models/category';
import { Competition } from '../../models/competition';
import { ConfirmModalComponent } from '../../popups/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../../popups/snackbar-content/snackbar-content.component';
import { DOCUMENT } from '@angular/common'; 
import { Entry } from '../../models/entry';
import { MatSelect } from '@angular/material/select';
import { County } from '../../models/County';
import { UtilsService } from '../../services/utils.service';

export class RowElement {
  name: string;
  isRegistered: boolean;
  isEditable: boolean;
  isChanged: boolean;
  counter: number;
  id: number;

  constructor(n: string, reg: boolean, id: number) {
    this.name = n;
    this.isRegistered = reg;
    this.isEditable = !reg;
    this.isChanged = false;
    this.counter = 1;
    this.id = id;
  }
}

export class CoOrdinate {
  latitude: number;
  longitude: number;

  constructor(lat: number, long: number) {
    this.latitude = lat;
    this.longitude = long;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  countyControl = new FormControl('', [Validators.required]);
  branchControl = new FormControl('', [Validators.required]);
  ageGroupControl = new FormControl('', [Validators.required]);
  compControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  counties: County[];
  branches: Branch[];
  catagories: Category[];
  competitions: Competition[];
  county: County;
  branch: Branch;
  category: Category;
  competition: Competition;
  today = new Date();
  showCompetitions = false;
  abadonShip = false;
  loadComplete = false;
  enableSave: boolean = false;
  isTooEarlyToRegister = false;
  isTooFarFromVenue = false;
  displayedColumns: string[] = ['Name', 'Register'];
  tableData: RowElement[] = [];
  entries: Entry[];
  dataSource = new MatTableDataSource<RowElement>(this.tableData);
  venue: CoOrdinate;
  venueDistance: number;

  @ViewChild('catRef') catRef: MatSelect;
  @ViewChild('branchRef') branchRef: MatSelect;
  compareCounty = UtilsService.compareCounty;

  constructor(public dialog: MatDialog, 
    private service: RegistrationService, private router: Router,
    private snackbar: MatSnackBar, @Inject(DOCUMENT) document) { }

  ngOnInit() {
    this.tableData = [];
    this.entries = [];
    this.today.setHours(0, 0, 0, 0);
    this.service.getAllCountyNames()
      .then((res) => {
        this.counties = res;
        // this.counties = [new County(1, 'Galway', new Date()), new County(18, 'Mayo', new Date())];
        this.counties.sort((a, b) => a.county_name > b.county_name ? 1 : -1);
        this.county = UtilsService.getCountyFromLocalStorage(this.counties);
        this.loadComplete = true;
      })
      .catch((err) => {
        this.abadonShip = true;
        console.log('No counties retrieved', err);
      });
  }

  getVenueLocation() {
    this.service.getVenueLocation(this.county.id)
      .then((res) => {
        this.venue = new CoOrdinate(res[0].latitude, res[0].longitude);
        this.venueDistance = res[0].distance;
      })
      .catch((err) => {
        this.venue = null;
        this.venueDistance = -1;
        console.log('Error getting venue location', err);
      });
  }

  changeCounty(county) {
    this.county = county;
    localStorage.setItem('selectedCounty', this.county.county_name);
    this.showCompetitions = false;
    this.isTooEarlyToRegister = false;
    this.isTooFarFromVenue = false;
    this.branch = null;
    this.competition = null;
    this.category = null;
    if (this.branchRef) this.branchRef.options.forEach((el) => el.deselect());
    // this.service.getAllBranchNames(this.county.id)
    //   .then((res) => {
    //     this.branches = res;
    //     this.branches.sort((a, b) => a.branch_name > b.branch_name ? 1 : -1);
    //   });
    // this.getVenueLocation();
  }

  changeBranch(branch) {
    this.branch = branch;
    this.showCompetitions = false;
    this.isTooEarlyToRegister = false;
    this.isTooFarFromVenue = false;
    this.competition = null;
    this.category = null;
    if (this.catRef) this.catRef.options.forEach((el) => el.deselect());
    if (!this.catagories) {
      this.service.getAllCategories()
      .then((res) => {
        this.catagories = res;
        this.catagories.sort((a, b) => a.category > b.category ? 1 : -1);
      });
    }
  }

  changeCategory(cat) {
    this.category = cat;
    this.showCompetitions = false;
    this.isTooEarlyToRegister = false;
    this.isTooFarFromVenue = false;
    this.competition = null;
    if (this.category) {
      this.service.getCompetitionByAgeGroup(this.category.id)
        .then((res) => {
          this.competitions = res;
          this.competitions.sort((a, b) => a.competition_number > b.competition_number ? 1 : -1);
        });
    }
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.showCompetitions = false;
    this.isTooEarlyToRegister = false;
    this.isTooFarFromVenue = false;
  }

  onSubmit() {
    if (this.showCompetitions) return;
    this.tableData = [];
    this.entries = [];
    if (this.isCompDateToday(this.county.fleadh_date)) {
      this.isUserAtTheVenue()
        .then((result) => {
          if (result) {
            this.isTooFarFromVenue = false;
            this.service.getEntries(this.competition.id, this.county.id)
              .then((res) => {
                this.branchFiltering(res);
              });
          } else {
            this.isTooFarFromVenue = true;
          }
        })
        .catch((err) => {
          console.log('Error in getCurrentPosition: '+err);
          this.service.getEntries(this.competition.id, this.county.id)
            .then((res) => {
              this.branchFiltering(res);
            });
        });
    } else {
      this.isTooEarlyToRegister = true;
    }
  }

  saveEntries() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '750px',
      height: '500px',
      data: {
        title: 'Confirm Registration', 
        ageGroup: this.category.age_group,
        competition: this.competition.competition_name,
        county: this.county.county_name,
        entrants: this.tableData.filter((entrant) => {
          if (entrant.isRegistered && entrant.isEditable) {
            return entrant;
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tableData.forEach((row) => {
          const index = this.entries.findIndex(entry => entry.id == row.id);
          this.entries[index].registered = row.isRegistered;
        });
        this.service.saveEntries(this.entries)
          .then((res) => {
            this.openSnackbar('green-snackbar', 'Registration successful');
          })
          .catch((err) => {
            console.log('Theres an error', err);
            this.openSnackbar('red-snackbar', 'Error saving registration');
          })
          .finally(() => {
            this.tableData = [];
            this.showCompetitions = false;
            this.enableSave = false;
          });
      }
    });
  }

  openSnackbar(css, message) {
    this.snackbar.openFromComponent(SnackbarContentComponent, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      data: {message},
      panelClass: [css]
    });
  }

  shouldEnableSave($event, i) {
    this.tableData[i].counter++;
    this.tableData[i].isChanged = !this.isOdd(this.tableData[i].counter);
    this.enableSave = this.tableData.filter((entrant) => entrant.isChanged == true).length > 0;
  }

  private isCompDateToday(compDate) {
    if (compDate === null || compDate === undefined) return true;
    const date = new Date(compDate);
    let result = false;
    if (this.today >= date) {
      result = true;
    }
    return result;
  }

  private isUserAtTheVenue(): Promise<boolean> {
    if (!navigator && !navigator.geolocation) return Promise.resolve(true); // can't get location just return true
    if (this.venue === null || this.venueDistance === -1) return Promise.resolve(true); // parameters not set

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(position.coords.latitude - this.venue.latitude);
        const dLon = this.deg2rad(position.coords.longitude - this.venue.longitude);
  
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(position.coords.latitude)) * Math.cos(this.deg2rad(this.venue.latitude)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distance in km
        resolve(d < this.venueDistance);
      }, (err) => {
        reject(err);
      });
    });
  }

  private deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  private isOdd(num) {
    return Boolean(num % 2);
  }

  private branchFiltering(entries: Entry[]) {
    let promise = entries.map((entry) => {
      return this.service.getEntrantById(entry.entrant)
        .then((firstEntrant: Entrant) => {
          if (firstEntrant && firstEntrant.branch === this.branch.id) {
            this.pushTableData(entry);
          } else if (entry.entrant2 && entry.entrant2 !== 0) {
              return this.service.getEntrantById(entry.entrant2)
                .then((secondEntrant: Entrant) => {
                  if (secondEntrant && secondEntrant.branch === this.branch.id) {
                    this.pushTableData(entry);
                  } else if (entry.entrant3 && entry.entrant3 !== 0) {
                    return this.service.getEntrantById(entry.entrant3)
                      .then((thirdEntrant: Entrant) => {
                        if (thirdEntrant && thirdEntrant.branch === this.branch.id) {
                          this.pushTableData(entry);
                        }
                      });
                  }
                });
          }
        });
    });
    Promise.all(promise).then(() => {
      this.tableData.sort((a, b) => a.name > b.name ? 1 : -1);
      this.dataSource = new MatTableDataSource<RowElement>(this.tableData);
      this.showCompetitions = true;
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  private pushTableData(entry: Entry) {
    let temp: RowElement;
    this.entries.push(entry);
    const name = entry.instrumentList ?
      entry.entrantName + " " + entry.instrumentList : entry.entrantName;
    temp = new RowElement(name, entry.registered, entry.id);
    this.tableData.push(temp);
  }
}
