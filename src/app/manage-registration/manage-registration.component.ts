import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { Branch } from '../models/branch';
import { Category } from '../models/category';
import { Competition } from '../models/competition';
import { Entries } from '../models/entries';
import { RegistrationService } from '../services/registration.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Entrant } from '../models/entrant';
import { Router } from '@angular/router';
import { SnackbarContentComponent } from '../snackbar-content/snackbar-content.component';

export class RowElement {
  name: string;
  isRegistered: boolean;
  isChanged: boolean;
  counter: number;

  constructor(n: string, reg: boolean) {
    this.name = n;
    this.isRegistered = reg;
    this.isChanged = false;
    this.counter = 1;
  }
}

@Component({
  selector: 'app-manage-registration',
  templateUrl: './manage-registration.component.html',
  styleUrls: ['./manage-registration.component.css']
})
export class ManageRegistrationComponent implements OnInit {
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
  displayedColumns: string[] = ['Name', 'Register'];
  tableData: RowElement[];
  entries: Entries[];
  enableSave: boolean = false;
  dataSource = new MatTableDataSource<RowElement>(this.tableData);

  constructor(public dialog: MatDialog, private service: RegistrationService,
    public router: Router, private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.tableData = [];
    this.entries = [];
    this.service.getAllBranchNames()
      .then((res) => {
        this.branches = res;
        this.branches.sort((a, b) => a.branchName > b.branchName ? 1 : -1);
      });
  }

  changeBranch(branch) {
    this.branch = branch;
    this.showCompetitions = false;
    if (!this.catagories) {
      this.service.getAllCategories()
      .then((res) => this.catagories = res);
    }
  }

  changeCategory(cat) {
    this.category = cat;
    this.showCompetitions = false;
    this.service.getCompetitionByAgeGroup(this.category.id)
      .then((res) => {
        this.competitions = res;
        this.competitions.sort((a, b) => a.competition_name > b.competition_name ? 1 : -1);
      });
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.showCompetitions = false;
  }

  onSubmit() {
    this.tableData = [];
    this.entries = [];
    this.service.getEntries(this.competition.id)
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
        branch: this.branch.branchName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tableData.forEach((row, i) => {
          this.entries[i].registered = row.isRegistered;
        });
        this.service.saveEntries(this.entries)
          .then((res) => {
            console.log(res);
            this.openSnackbar('green-snackbar', 'Changes saved successful');
          })
          .catch((err) => {
            console.log('theres an error', err);
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

  private branchFiltering(entries: Entries[]) {
    let temp: RowElement;
    let promise = entries.map((entrant) => {
      return this.service.getEntrantById(entrant.entrant)
        .then((res2: Entrant) => {
          if (res2) {
            if (res2.branch === this.branch.id) {
              this.entries.push(entrant);
              temp = new RowElement(res2.entrant_name, entrant.registered);
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