import { Component, OnInit } from '@angular/core';
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
  tableData: RowElement[] = [];
  entries: Entry[];
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
        this.branches.sort((a, b) => a.branch_name > b.branch_name ? 1 : -1);
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
        isManageReg: true
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