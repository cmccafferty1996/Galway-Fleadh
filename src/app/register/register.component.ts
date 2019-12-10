import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { RegistrationService } from '../services/registration.service';
import { Branch } from '../models/branch';
import { Entrant } from '../models/entrant';
import { Category } from '../models/category';
import { Competition } from '../models/competition';
import { Entries } from '../models/entries';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

export class RowElement {
  name: string;
  isRegistered: boolean;
  isEditable: boolean;

  constructor(n: string, reg: boolean) {
    this.name = n;
    this.isRegistered = reg;
    this.isEditable = !reg;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  location: number[];
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
  displayedColumns: string[] = ['name', 'registered'];
  tableData: RowElement[];
  entries: Entries[];
  enableSave: boolean = false;
  dataSource = new MatTableDataSource<RowElement>(this.tableData);

  constructor(public dialog: MatDialog, 
    private service: RegistrationService, private router: Router) { }

  ngOnInit() {
    this.location = [];
    this.getLocation();
    this.tableData = [];
    this.entries = [];
    this.service.getAllBranchNames()
      .then((res) => this.branches = res);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location.push(position.coords.latitude);
        this.location.push(position.coords.longitude);
      })
    }
  }

  changeBranch(branch) {
    this.branch = branch;
    if (!this.catagories) {
      this.service.getAllCategories()
      .then((res) => this.catagories = res);
    }
  }

  changeCategory(cat) {
    this.category = cat;
    this.service.getCompetitionByAgeGroup(this.category.id)
      .then((res) => this.competitions = res);
  }

  changeCompetition(comp) {
    this.competition = comp;
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
        title: 'Confirm Registration', 
        ageGroup: this.category.age_group,
        competition: this.competition.competition_name,
        entrants: this.tableData.filter((entrant) => {
          if (entrant.isRegistered && entrant.isEditable) {
            return entrant;
          }
        }),
        branch: this.branch.branchName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tableData.forEach((row, i) => {
          this.entries[i].registered = row.isRegistered;
        });
        this.service.saveEntries(this.entries)
          .then((res) => console.log(res))
          .finally(() => {
            this.tableData = [];
            this.showCompetitions = false;
            this.enableSave = false;
          });
      }
    });
  }

  shouldEnableSave($event) {
    const registered = this.tableData.filter((entrant) => entrant.isRegistered == true);
    this.enableSave = (registered.length > 0);
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
      this.dataSource = new MatTableDataSource<RowElement>(this.tableData);
      this.showCompetitions = true;
    });
  }
}

