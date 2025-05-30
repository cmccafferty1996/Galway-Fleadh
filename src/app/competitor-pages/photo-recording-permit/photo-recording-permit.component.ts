import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Entrant } from '../../models/entrant';
import { SnackbarContentComponent } from '../../popups/snackbar-content/snackbar-content.component';
import { SlipsTableRow } from '../late-withdrawal-form/late-withdrawal-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../../models/category';
import { SlipsService } from '../../services/slips.service';
import { Slip } from '../../models/Slip';
import { Competition } from '../../models/competition';
import { County } from '../../models/County';

const MOBILE_PATTERN = '[- +0-9]+';

@Component({
  selector: 'photo-recording-permit',
  templateUrl: './photo-recording-permit.component.html',
  styleUrls: ['./photo-recording-permit.component.css']
})
export class PhotoRecordingPermitComponent implements OnInit {

  @Input() entrant: Entrant;
  @Input() competition: Competition;
  @Input() ageGroup: Category;
  @Input() county: County;

  displayedColumns: string[] = ['Age Group', 'Competition Name', 'Record'];
  compViewDisplayedColumns: string[] = ['Name', 'Record'];
  infoText: string = 'Request Photography/Recording Permit for ';
  tableData: SlipsTableRow[] = [];
  compViewTableData: SlipsTableRow[] = [];
  categories: Category[];
  dataSource = new MatTableDataSource<SlipsTableRow>(this.tableData);
  compViewDataSource = new MatTableDataSource<SlipsTableRow>(this.compViewTableData);
  nameControl = new UntypedFormControl('', [Validators.required]);
  addressControl = new UntypedFormControl('', [Validators.required]);
  addressLineTwo: string = null;
  town: string = null;
  countyControl = new UntypedFormControl('', [Validators.required]);
  emailControl = new UntypedFormControl('', [Validators.email, Validators.required]);
  phoneNoControl = new UntypedFormControl('', [Validators.pattern(MOBILE_PATTERN), Validators.required]);
  isSubmitDisabled: boolean = true;
  loadComplete: boolean = false;
  isAgreeClicked: boolean = false;
  isCreatingSlips: boolean = false;

  constructor(private snackbar: MatSnackBar, private service: SlipsService) { }

  ngOnInit(): void {
    if (this.competition) {
      this.infoText += `group in ${this.ageGroup.category} ${this.ageGroup.age_group} ${this.competition.competition_name}`;
      this.service.getEntries(this.competition.id, this.county.id)
        .then((res) => {
          res.forEach((entry) => {
            this.compViewTableData.push(new SlipsTableRow(entry.id, entry.entrantName, null, null))
          });
          this.compViewDataSource = new MatTableDataSource<SlipsTableRow>(this.compViewTableData);
          this.loadComplete = true;
        })
        .catch((err) => {
          console.log('Error getting entries for competition', err);
          this.loadComplete = true;
        });
    } else {
      this.infoText += this.entrant.entrant_name;
      this.service.getCompetitionsByEntrant([this.entrant.id], 3)
      .then((res) => {
        if (res.length > 0) {
          this.service.getAllCategories()
            .then((res2) => {
              this.categories = res2;
              res.forEach((comp) => {
                const currentCategory = this.categories.find((cat) => cat.id == comp.ageGroup);
                this.tableData.push(
                  new SlipsTableRow(comp.entryId, null, currentCategory.category + ' ' + currentCategory.age_group, comp.competitionName)
                );
              });
              this.dataSource = new MatTableDataSource<SlipsTableRow>(this.tableData);
              this.loadComplete = true;
            });
        }
      })
      .catch((err) => {
        console.log('Error getting entrant competitions', err);
        this.loadComplete = true;
      });
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

  onCheckBoxSelected() {
    const selectedRows = this.tableData.length == 0 ? this.compViewTableData.filter((row) => row.isChecked) : this.tableData.filter((row) => row.isChecked);
    if (selectedRows.length == 0) {
      this.isSubmitDisabled = true;
    } else {
      this.isSubmitDisabled = false;
    }
  }

  onAgreeClicked() {
    this.isAgreeClicked = !this.isAgreeClicked;
  }

  onSubmit() {
    // Name field is empty
    if (this.nameControl.value === null || this.nameControl.value === undefined
      || this.nameControl.value === '' || this.nameControl.hasError('required')) {
      this.openSnackbar('red-snackbar', 'Please enter your full name');
      this.nameControl.markAsTouched();
      return;
    }

    // Address line 1 field is empty
    if (this.addressControl.value === null || this.addressControl.value === undefined
      || this.addressControl.value === '' || this.addressControl.hasError('required')) {
      this.openSnackbar('red-snackbar', 'Please enter your address');
      this.addressControl.markAsTouched();
      return;
    }

    // County field is empty
    if (this.countyControl.value === null || this.countyControl.value === undefined
      || this.countyControl.value === '' || this.countyControl.hasError('required')) {
      this.openSnackbar('red-snackbar', 'Please enter your county');
      this.countyControl.markAsTouched();
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

    // Email field is empty
    if (this.emailControl.value === null || this.emailControl.value === undefined
      || this.emailControl.value === '' || this.emailControl.hasError('required')) {
      this.openSnackbar('red-snackbar', 'Please enter your email address');
      this.emailControl.markAsTouched();
      return
    }

    // Email has incorrect format
    if (this.emailControl.hasError('email')) {
      this.openSnackbar('red-snackbar', 'Please enter a valid email address');
      this.emailControl.markAsTouched();
      return;
    }

    this.createSlips();
  }

  createSlips() {
    this.isCreatingSlips = true;
    let slips: Slip[] = [];
    let selectedRows;
    if (this.tableData.length > 0) {
      selectedRows = this.tableData.filter((row) => row.isChecked);
    } else {
      selectedRows = this.compViewTableData.filter((row) => row.isChecked);
    }
    selectedRows.forEach((row) => {
      slips.push(new Slip(3, row.entryId, this.nameControl.value, this.phoneNoControl.value,
        this.emailControl.value, this.addressControl.value, this.addressLineTwo, this.town, this.countyControl.value
      ));
    });

    this.service.createSlips(slips)
      .then(() => {
        this.isCreatingSlips = false;
        this.openSnackbar('green-snackbar', `Successfully created ${selectedRows.length} recording permit(s).`);
      })
      .catch((err) => {
        this.isCreatingSlips = false;
        console.log('Error creating recording permit', err);
        this.openSnackbar('red-snackbar', 'Error creating recording permit.');
      })
  }
}
