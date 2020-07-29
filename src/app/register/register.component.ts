import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { RegistrationService } from '../services/registration.service';
import { Branch } from '../models/branch';
import { Entrant } from '../models/entrant';
import { Category } from '../models/category';
import { Competition } from '../models/competition';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../snackbar-content/snackbar-content.component';
import { DOCUMENT } from '@angular/common'; 
import { Entry } from '../models/entry';

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

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  branchControl = new FormControl('', [Validators.required]);
  categoryControl = new FormControl('', [Validators.required]);
  compControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  branches: Branch[];
  catagories: Category[];
  competitions: Competition[];
  branch: Branch;
  category: Category;
  competition: Competition;
  today = new Date();
  showCompetitions = false;
  abadonShip = false;
  loadComplete = false;
  enableSave: boolean = false;
  isTooEarlyToRegister = false;
  displayedColumns: string[] = ['Name', 'Register'];
  tableData: RowElement[];
  entries: Entry[];
  dataSource = new MatTableDataSource<RowElement>(this.tableData);

  constructor(public dialog: MatDialog, 
    private service: RegistrationService, private router: Router,
    private snackbar: MatSnackBar, @Inject(DOCUMENT) document) { }

  ngOnInit() {
    this.tableData = [];
    this.entries = [];
    this.today.setHours(0, 0, 0, 0);
    this.service.getAllBranchNames()
      .then((res) => {
        this.branches = res;
        this.branches.sort((a, b) => a.branch_name > b.branch_name ? 1 : -1);
        this.loadComplete = true;
      })
      .catch((err) => {
        this.abadonShip = true;
        console.log('No branches retrieved', err);
      });
  }

  changeBranch(branch) {
    this.branch = branch;
    this.showCompetitions = false;
    this.isTooEarlyToRegister = false;
    if (!this.catagories) {
      this.service.getAllCategories()
      .then((res) => this.catagories = res);
    }
  }

  changeCategory(cat) {
    this.category = cat;
    this.showCompetitions = false;
    this.isTooEarlyToRegister = false;
    this.service.getCompetitionByAgeGroup(this.category.id)
      .then((res) => {
        this.competitions = res;
        this.competitions.sort((a, b) => a.competition_name > b.competition_name ? 1 : -1);
      });
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.showCompetitions = false;
    this.isTooEarlyToRegister = false;
  }

  onSubmit() {
    if (this.showCompetitions) return;
    this.tableData = [];
    this.entries = [];
    if (this.isCompDateToday(this.competition.competition_date)) {
      this.service.getEntries(this.competition.id)
        .then((res) => {
          this.branchFiltering(res);
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
            console.log(res);
            this.openSnackbar('green-snackbar', 'Registration successful');
          })
          .catch((err) => {
            console.log('theres an error', err);
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
    const date = new Date(compDate);
    let result = false;
    if (this.today >= date) {
      result = true;
    }
    return result;
  }

  private isOdd(num) {
    return Boolean(num % 2);
  }

  private branchFiltering(entries: Entry[]) {
    let temp: RowElement;
    let promise = entries.map((entry) => {
      return this.service.getEntrantById(entry.entrant)
        .then((res2: Entrant) => {
          if (res2) {
            if (res2.branch === this.branch.id) {
              this.entries.push(entry);
              const name = entry.instrumentList ?
                entry.entrantName + " " + entry.instrumentList : entry.entrantName;
              temp = new RowElement(name, entry.registered, entry.id);
              this.tableData.push(temp);
            }
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
}

