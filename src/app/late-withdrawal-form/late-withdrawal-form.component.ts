import { Component, Input, OnInit } from '@angular/core';
import { Entrant } from '../models/entrant';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';

export class LateWithdrawalTableRow {
  ageGroup: string;
  competition: string;
  isChecked: boolean = false;

  constructor(age: string, comp: string) {
    this.ageGroup = age;
    this.competition = comp;
  }
}

const MOBILE_PATTERN = '[- +()0-9]+';

@Component({
  selector: 'late-withdrawal-form',
  templateUrl: './late-withdrawal-form.component.html',
  styleUrls: ['./late-withdrawal-form.component.css']
})
export class LateWithdrawalFormComponent implements OnInit {

  @Input() entrant: Entrant;
  @Input() isLateForm: boolean;

  displayedColumns: string[] = ['Age Group', 'Competition Name', 'Late'];
  formType: string;
  tableData: LateWithdrawalTableRow[] = [];
  checkBoxCounter: number = 0;
  dataSource = new MatTableDataSource<LateWithdrawalTableRow>(this.tableData);
  phoneNoControl = new FormControl('', [Validators.pattern(MOBILE_PATTERN), Validators.required]);

  constructor() { }

  ngOnInit(): void {
    this.tableData = [
      new LateWithdrawalTableRow('U12', 'Fiddle - Fidil'),
      new LateWithdrawalTableRow('U12', 'Duet - Bert'),
      new LateWithdrawalTableRow('12-15', 'Fiddle - Fidil')
    ];
    this.dataSource = new MatTableDataSource<LateWithdrawalTableRow>(this.tableData);
    this.formType = this.isLateForm ? 'Late' : 'Non-Compete';
  }

  onCheckBoxClicked(event, index) {
    if (this.formType == 'Late') {
      if (event.checked) {
        this.checkBoxCounter++;
      } else {
        this.checkBoxCounter--;
      }
    }
  }

  onSubmit() {
  }

}
