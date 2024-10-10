import { Component, Input, OnInit } from '@angular/core';
import { Entrant } from '../../models/entrant';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { Competition } from '../../models/competition';

export class LateWithdrawalTableRow {
  ageGroup: string;
  competition: string;
  isChecked: boolean = false;

  constructor(age: string, comp: string) {
    this.ageGroup = age;
    this.competition = comp;
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
  @Input() isLateForm: boolean;

  displayedColumns: string[] = ['Age Group', 'Competition Name', 'Late'];
  formType: string;
  tableData: LateWithdrawalTableRow[] = [];
  dataSource = new MatTableDataSource<LateWithdrawalTableRow>(this.tableData);
  nameControl = new FormControl('', [Validators.required]);
  phoneNoControl = new FormControl('', [Validators.pattern(MOBILE_PATTERN), Validators.required]);
  category: Category;
  categories: Category[];
  groupCompetition: Competition;
  groupCompetitions: Competition[];

  constructor() { }

  ngOnInit(): void {
    this.tableData = [
      new LateWithdrawalTableRow('U12', 'Fiddle - Fidil'),
      new LateWithdrawalTableRow('U12', 'Duet - Bert'),
      new LateWithdrawalTableRow('12-15', 'Fiddle - Fidil')
    ];
    this.categories = [
      new Category(1, 'A', 'U12'),
      new Category(2, 'B', '12 - 15'),
      new Category(3, 'C', 'U15')
    ];
    this.groupCompetitions = [
      new Competition(1, 1, 'Grupa Cheoil', 1, 2),
      new Competition(1, 1, 'Ceili Band', 1, 2)
    ]
    this.dataSource = new MatTableDataSource<LateWithdrawalTableRow>(this.tableData);
    this.formType = this.isLateForm ? 'Late' : 'Non-Compete';
  }

  onSubmit() {
  }

  changeCategory(cat) {
    this.category = cat;
  }

  changeCompetition(group) {
    this.groupCompetition = group;
  }

}
