import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Competition } from '../models/competition';
import { County } from '../models/County';
import { FormControl, Validators } from '@angular/forms';
import { Category } from '../models/category';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SlipsPermitsModalComponent } from '../slips-permits-modal/slips-permits-modal.component';

export class LateSlipTableRow {
  name: string;
  notifiedBy: string;
  phoneNumber: string;

  constructor(name: string, notified: string, phone: string) {
    this.name = name;
    this.notifiedBy = notified;
    this.phoneNumber = phone;
  }
}

@Component({
  selector: 'manage-slips',
  templateUrl: './manage-slips.component.html',
  styleUrls: ['./manage-slips.component.css']
})
export class ManageSlipsComponent implements OnInit {

  countyControl = new FormControl('', [Validators.required]);
  categoryControl = new FormControl('', [Validators.required]);
  competitionControl = new FormControl('', Validators.required);
  slipControl = new FormControl('', Validators.required);
  slip: string;
  county: County;
  category: Category;
  competition: Competition;
  entrantCompetitions: Competition[];
  slips: string[] = ['Recording Permit', 'Late Slip', 'Non-Compete Slip'];
  counties: County[];
  categories: Category[];
  competitions: Competition[];
  lateSlipColumns: string[] = ['Competitor Name', 'Notified By', 'Contact Number', 'Open Slip'];
  nonCompeteSlipColumns: string[] = ['Competitor Name', 'Notified By'];
  tableData: LateSlipTableRow[] = [];
  dataSource = new MatTableDataSource<LateSlipTableRow>(this.tableData);
  showSlips = false;
  isLoggedIn = true;
  isLoginCheckDone = true;

  @ViewChild('countyRef') countyRef: MatSelect;
  @ViewChild('catRef') catRef: MatSelect;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.counties = [
      new County(1, 'Galway', new Date()),
      new County(2, 'Sligo', new Date()),
      new County(3, 'Limerick', new Date())
    ];

    this.categories = [
      new Category(1, 'A', 'U12'),
      new Category(1, 'B', '12-15'),
      new Category(1, 'C', '15-18')
    ];

    this.competitions = [
      new Competition(1, 1, 'Fiddle - Fidil', 1, 1),
      new Competition(2, 2, 'Button Accordion - Bosca Ceoil', 1, 1),
      new Competition(3, 3, 'Tin Whistle - feadóg stáin', 1, 1),
    ];

    this.entrantCompetitions = [
      new Competition(1, 1, 'Fiddle - Fidil', 1, 1),
      new Competition(2, 2, 'Button Accordion - Bosca Ceoil', 1, 1),
      new Competition(3, 3, 'Tin Whistle - feadóg stáin', 1, 1),
    ];
  }

  changeSlip(selection) {
    this.slip = selection;
    this.showSlips = false;
    this.counties.sort((a, b) => a.county_name > b.county_name ? 1 : -1);
  }

  changeCounty(county) {
    this.county = county;
    this.showSlips = false;
    this.category = null;
    this.competition = null;
    if (this.catRef) this.catRef.options.forEach((el) => el.deselect());
    this.categories.sort((a, b) => a.category > b.category ? 1 : -1);
  }

  changeCategory(cat) {
    this.category = cat;
    this.showSlips = false;
    this.competition = null;
    this.competitions.sort((a, b) => a.competition_number > b.competition_number ? 1 : -1);
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.showSlips = false;
  }

  searchSlips() {
    this.tableData = [
      new LateSlipTableRow('Sarah Jones', 'Dan Jones', '(085) 12345566'),
      new LateSlipTableRow('Jack Smith', 'Amanda Byrne', '(085) 12345566'),
      new LateSlipTableRow('Martin Ni Cheideannna', 'Sheosamh Ni Cheideannna', '(085) 12345566'),
      new LateSlipTableRow('Robin Meeblind', 'Dan Jones', '(085) 12345566'),
    ];
    this.dataSource = new MatTableDataSource<LateSlipTableRow>(this.tableData);
    this.showSlips = true;
  }

  openDialog(rowData: LateSlipTableRow) {
    this.dialog.open(SlipsPermitsModalComponent, {
      width: '750px',
      height: '500px',
      data: {
        title: 'Late slip for ', 
        ageGroup: this.category.age_group,
        competition: this.competition.competition_name,
        entrantComps: this.entrantCompetitions,
        row: rowData
      }
    });
  }

}
