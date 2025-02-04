import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Entrant } from '../../models/entrant';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { Competition } from '../../models/competition';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarContentComponent } from '../../popups/snackbar-content/snackbar-content.component';
import { MatSelect } from '@angular/material/select';
import { Branch } from '../../models/branch';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSlipComponent } from '../../popups/confirm-slip/confirm-slip.component';
import { SlipsService } from '../../services/slips.service';
import { Slip } from '../../models/Slip';
import { Entry } from '../../models/entry';

export class SlipsTableRow {
  entryId: number;
  ageGroup: string;
  competition: string;
  slipExists: boolean = false
  isChecked: boolean = false;

  constructor(entry: number, age: string, comp: string, slipExists?: boolean) {
    this.entryId = entry;
    this.ageGroup = age;
    this.competition = comp;
    if (slipExists) {
      this.slipExists = true;
      this.isChecked = true;
    }
  }
}

export class GroupsTableRow {
  ageGroup: Category;
  groupComp: Competition;
  groupEntry: Entry;
  isDelete: boolean = false;

  constructor(age: Category, comp: Competition, entry: Entry) {
    this.ageGroup = age;
    this.groupComp = comp;
    this.groupEntry = entry;
  }
}

const MOBILE_PATTERN = '[- +0-9]+';

@Component({
  selector: 'late-withdrawal-form',
  templateUrl: './late-withdrawal-form.component.html',
  styleUrls: ['./late-withdrawal-form.component.css']
})
export class LateWithdrawalFormComponent implements OnInit {

  @Input() entrant: Entrant;
  @Input() branch: Branch;
  @Input() isLateForm: boolean;
  @ViewChild('catRef') catRef: MatSelect;
  @ViewChild('compRef') compRef: MatSelect;
  @ViewChild('groupRef') groupRef: MatSelect;

  displayedColumns: string[] = ['Age Group', 'Competition Name', 'Late'];
  groupDisplayedColumns: string[] = ['Group Name', 'Delete Group'];
  formType: string;
  tableData: SlipsTableRow[] = [];
  groupTableData: GroupsTableRow[] = [];
  dataSource = new MatTableDataSource<SlipsTableRow>(this.tableData);
  groupDataSource = new MatTableDataSource<GroupsTableRow>(this.groupTableData);
  nameControl = new UntypedFormControl('', [Validators.required]);
  phoneNoControl = new UntypedFormControl('', [Validators.pattern(MOBILE_PATTERN), Validators.required]);
  category: Category;
  categories: Category[];
  groupCompetition: Competition;
  groupCompetitions: Competition[] = [];
  groupEntries: Entry[] = [];
  groupEntry: Entry;
  showGroupsTable: boolean = false;
  isSubmitDisabled: boolean = true;
  loadComplete: boolean = false;

  constructor(private snackbar: MatSnackBar, public dialog: MatDialog, private service: SlipsService) { }

  ngOnInit(): void {
    const slipType = this.isLateForm ? 1 : 2;
    this.service.getCompetitionsByEntrant([this.entrant.id], slipType)
      .then((res) => {
        if (res.length > 0) {
          this.service.getAllCategories()
            .then((res2) => {
              this.categories = res2;
              res.forEach((comp) => {
                const currentCategory = this.categories.find((cat) => cat.id == comp.ageGroup);
                const slipExists = comp.slipNumber != 0;
                this.tableData.push(
                  new SlipsTableRow(comp.entryId, currentCategory.category + ' ' + currentCategory.age_group,
                    comp.competitionName, slipExists)
                );
              });
              this.dataSource = new MatTableDataSource<SlipsTableRow>(this.tableData);
              this.formType = this.isLateForm ? 'Late' : 'Non-Compete';
              this.loadComplete = true;
            });
        }
      })
      .catch((err) => {
        console.log('Error getting entrant competitions', err);
        this.loadComplete = true;
      });
  }

  changeCategory(cat) {
    this.category = cat;
    this.groupEntry = null;
    this.groupEntries = [];
    this.groupCompetition = null;
    this.service.getCompetitionsByAgeGroup(this.category.id)
      .then((competitions) => {
        this.groupCompetitions = competitions.filter(comp => comp.comp_type == 4);
      });
  }

  changeCompetition(groupComp) {
    this.groupCompetition = groupComp;
    this.groupEntry = null;
    this.service.getEntries(this.groupCompetition.id, this.branch.county)
      .then(entries => {
        this.groupEntries = entries;
      });
  }

  changeGroup(group) {
    this.groupEntry = group;
  }

  addGroupToSlip() {
    let groupAddedAlready = false;
    if (this.groupTableData !== null && this.groupTableData !== undefined) {
      this.groupTableData.forEach((row) => {
        if (row.groupEntry.id === this.groupEntry.id) groupAddedAlready = true;
      });
    }

    if (groupAddedAlready) {
      this.openSnackbar('red-snackbar', 'Group Already Added!', 2500);
      return;
    }

    this.groupTableData.push(new GroupsTableRow(this.category, this.groupCompetition, this.groupEntry));
    this.groupDataSource = new MatTableDataSource<GroupsTableRow>(this.groupTableData);
    this.groupCompetition = null;
    this.category = null;
    this.groupEntry = null;
    if (this.catRef) this.catRef.options.forEach((el) => el.deselect());
    if (this.compRef) this.compRef.options.forEach((el) => el.deselect());
    if (this.groupRef) this.groupRef.options.forEach((el) => el.deselect());
    this.showGroupsTable = true;
  }

  onCheckBoxSelected() {
    const selectedRows = this.tableData.filter((row) => row.isChecked);
    if (selectedRows.length == 0) {
      this.isSubmitDisabled = true;
    } else {
      this.isSubmitDisabled = false;
    }
  }

  openSnackbar(css, message, time = 5000) {
    this.snackbar.openFromComponent(SnackbarContentComponent, {
      duration: time,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      data: {message},
      panelClass: [css]
    });
  }

  removeGroup(row: GroupsTableRow) {
    row.isDelete = true;
    this.groupTableData = this.groupTableData.filter((group) => !group.isDelete);
    this.groupDataSource = new MatTableDataSource<GroupsTableRow>(this.groupTableData);
    this.showGroupsTable = this.groupTableData.length > 0;
  }

  onSubmit() {
    // Name field is empty
    if (this.nameControl.value === null || this.nameControl.value === undefined
      || this.nameControl.value === '' || this.nameControl.hasError('required')) {
      this.openSnackbar('red-snackbar', 'Please enter a name for the Notified By field');
      this.nameControl.markAsTouched();
      return;
    }

    // Phone number field is empty
    if (this.phoneNoControl.value === null || this.phoneNoControl.value === undefined
      || this.phoneNoControl.value === '' || this.phoneNoControl.hasError('required')) {
      this.openSnackbar('red-snackbar', 'Please enter a value for the Contact Number field');
      this.phoneNoControl.markAsTouched();
      return
    }

    // Phone number has incorrect format
    if (this.phoneNoControl.hasError('pattern')) {
      this.openSnackbar('red-snackbar', 'Please enter a valid phone number');
      return;
    }

    this.openConfirmPopup();
  }

  openConfirmPopup() {
    const dialogRef = this.dialog.open(ConfirmSlipComponent, {
      width: '750px',
      height: '500px',
      data: {
        title: `Confirm ${this.formType} Slip(s)`,
        branch: this.branch,
        entrant: this.entrant,
        groups: this.groupTableData,
        slips: this.tableData,
        slipType: this.formType
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createSlips();
      }
    });
  }

  createSlips() {
    let slips: Slip[] = [];
    const selectedRows = this.tableData.filter((row) => row.isChecked && !row.slipExists);
    const slipType = this.isLateForm ? 1 : 2;
    selectedRows.forEach((row) => {
      slips.push(new Slip(slipType, row.entryId, this.nameControl.value, this.phoneNoControl.value,
        null, null, null, null, null
      ));
    });

    this.service.createSlips(slips)
      .then((newSlip: number[]) => {
        this.openSnackbar('green-snackbar', `Successfully created ${selectedRows.length} slip(s).`);
        if (this.groupTableData.length > 0) {
          this.groupTableData.forEach(group => {
            newSlip.forEach((slipId) => {
              this.service.createSlipGroup(group.groupEntry.id, slipId)
                .catch((addGroupErr) => {
                  console.log('Error adding group to slips', addGroupErr);
                });
            });
          });
        }
      })
      .catch((err) => {
        console.log('Error creating slips', err);
        this.openSnackbar('red-snackbar', 'Error creating slips.');
      });
  }
}
