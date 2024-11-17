import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Branch } from '../../models/branch';
import { Entrant } from '../../models/entrant';
import { SnackbarContentComponent } from '../../popups/snackbar-content/snackbar-content.component';
import { SlipsTableRow } from '../late-withdrawal-form/late-withdrawal-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../../models/category';
import { SlipsService } from '../../services/slips.service';
import { Slip } from '../../models/Slip';

const MOBILE_PATTERN = '[- +0-9]+';

@Component({
  selector: 'photo-recording-permit',
  templateUrl: './photo-recording-permit.component.html',
  styleUrls: ['./photo-recording-permit.component.css']
})
export class PhotoRecordingPermitComponent implements OnInit {

  @Input() entrant: Entrant;
  @Input() branch: Branch;

  displayedColumns: string[] = ['Age Group', 'Competition Name', 'Record'];
  tableData: SlipsTableRow[] = [];
  categories: Category[];
  dataSource = new MatTableDataSource<SlipsTableRow>(this.tableData);
  nameControl = new FormControl('', [Validators.required]);
  addressControl = new FormControl('', [Validators.required]);
  addressLineTwo: string = null;
  town: string = null;
  countyControl = new FormControl('', [Validators.required]);
  emailControl = new FormControl('', [Validators.email, Validators.required]);
  phoneNoControl = new FormControl('', [Validators.pattern(MOBILE_PATTERN), Validators.required]);
  isSubmitDisabled: boolean = true;
  loadComplete: boolean = false;
  isAgreeClicked: boolean = false;

  constructor(private snackbar: MatSnackBar, private service: SlipsService) { }

  ngOnInit(): void {
    this.service.getCompetitionsByEntrant([this.entrant.id], 3)
      .then((res) => {
        if (res.length > 0) {
          this.service.getAllCategories()
            .then((res2) => {
              this.categories = res2;
              res.forEach((comp) => {
                const currentCategory = this.categories.find((cat) => cat.id == comp.ageGroup);
                this.tableData.push(
                  new SlipsTableRow(comp.entryId, currentCategory.category + ' ' + currentCategory.age_group, comp.competitionName)
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
    const selectedRows = this.tableData.filter((row) => row.isChecked);
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
    let slips: Slip[] = [];
    const selectedRows = this.tableData.filter((row) => row.isChecked);
    selectedRows.forEach((row) => {
      slips.push(new Slip(3, row.entryId, this.nameControl.value, this.phoneNoControl.value,
        this.emailControl.value, this.addressControl.value, this.addressLineTwo, this.town, this.countyControl.value
      ));
    });

    this.service.createSlips(slips)
      .then(() => {
        this.openSnackbar('green-snackbar', `Successfully created ${selectedRows.length} recording permit(s).`);
      })
      .catch((err) => {
        console.log('Error creating recording permit', err);
        this.openSnackbar('red-snackbar', 'Error creating recording permit.');
      })
  }
}
