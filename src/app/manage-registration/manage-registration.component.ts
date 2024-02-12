import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Branch } from '../models/branch';
import { Category } from '../models/category';
import { Competition } from '../models/competition';
import { RegistrationService } from '../services/registration.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Entrant } from '../models/entrant';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../snackbar-content/snackbar-content.component';
import { Entry } from '../models/entry';
import { MatSelect } from '@angular/material/select';
import { County } from '../models/County';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';

export class RowElement {
  name: string;
  isRegistered: boolean;
  isChanged: boolean;
  counter: number;
  id: number;

  constructor(n: string, reg: boolean, id: number) {
    this.name = n;
    this.isRegistered = reg;
    this.isChanged = false;
    this.counter = 1;
    this.id = id;
  }
}

@Component({
  selector: 'app-manage-registration',
  templateUrl: './manage-registration.component.html',
  styleUrls: ['./manage-registration.component.css']
})
export class ManageRegistrationComponent implements OnInit {
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
  displayedColumns: string[] = ['Name', 'Register'];
  tableData: RowElement[] = [];
  entries: Entry[];
  enableSave: boolean = false;
  dataSource = new MatTableDataSource<RowElement>(this.tableData);
  isLoggedIn = false;
  isLoginCheckDone = false;
  subscription: Subscription;

  @ViewChild('catRef') catRef: MatSelect;
  @ViewChild('branchRef') branchRef: MatSelect;

  constructor(public dialog: MatDialog, private service: RegistrationService,
    public router: Router, private snackbar: MatSnackBar, private login: LoginService) { }

  ngOnInit() {
    this.tableData = [];
    this.entries = [];
    this.subscription = this.login.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res.isLoggedIn;
      this.isLoginCheckDone = true;
      if (this.isLoggedIn) {
        this.service.getAllCountyNames()
          .then((res: County[]) => {
            this.counties = res;
            this.counties.sort((a, b) => a.county_name > b.county_name ? 1 : -1);
          });
      }
    });
  }

  changeCounty(county) {
    this.county = county;
    this.showCompetitions = false;
    this.branches = null;
    this.branch = null;
    this.competition = null;
    this.category = null;
    if (this.branchRef) this.branchRef.options.forEach((el) => el.deselect());
    this.service.getAllBranchNames(this.county.id)
      .then((res) => {
        this.branches = res;
        this.branches.sort((a, b) => a.branch_name > b.branch_name ? 1 : -1);
      });
  }

  changeBranch(branch) {
    this.branch = branch;
    this.showCompetitions = false;
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
  }

  onSubmit() {
    this.tableData = [];
    this.entries = [];
    this.service.getEntries(this.competition.id, this.county.id)
      .then((res) => {
        this.branchFiltering(res);
      });
  }

  saveEntries() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '750px',
      height: '500px',
      data: {
        title: 'Confirm Registration Updates', 
        ageGroup: this.category.age_group,
        competition: this.competition.competition_name,
        entrants: this.tableData.filter((entrant) => entrant.isChanged == true),
        isManageReg: true,
        county: this.county.county_name
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
            this.openSnackbar('green-snackbar', 'Changes saved successful');
          })
          .catch((err) => {
            console.log('Theres an error', err);
            this.openSnackbar('red-snackbar', 'Error saving changes');
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
      data: {message},
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [css]
    });
  }

  shouldEnableSave($event, i) {
    this.tableData[i].counter++;
    this.tableData[i].isChanged = !this.isOdd(this.tableData[i].counter);
    this.enableSave = this.tableData.filter((entrant) => entrant.isChanged == true).length > 0;
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