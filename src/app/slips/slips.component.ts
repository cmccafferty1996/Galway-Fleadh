import { Component, OnInit, ViewChild } from '@angular/core';
import { County } from '../models/County';
import { FormControl, Validators } from '@angular/forms';
import { Branch } from '../models/branch';
import { Entrant } from '../models/entrant';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'slips',
  templateUrl: './slips.component.html',
  styleUrls: ['./slips.component.css']
})
export class SlipsComponent implements OnInit {

  countyControl = new FormControl('', [Validators.required]);
  branchControl = new FormControl('', [Validators.required]);
  entrantControl = new FormControl('', Validators.required);
  slipControl = new FormControl('', Validators.required);
  slip: string;
  county: County;
  branch: Branch;
  entrant: Entrant;
  slips: string[] = ['Recording Permit', 'Late Slip', 'Non-Compete Slip'];
  counties: County[];
  branches: Branch[];
  entrants: Entrant[];
  onSubmitClicked = false;
  abadonShip = false;
  loadComplete = false;
  showForm = false;

  @ViewChild('countyRef') countyRef: MatSelect;
  @ViewChild('branchRef') branchRef: MatSelect;
  @ViewChild('entrantRef') entrantRef: MatSelect;

  constructor() { }

  ngOnInit(): void {
    this.counties = [
      new County(1, 'Galway', new Date()),
      new County(2, 'Sligo', new Date()),
      new County(3, 'Limerick', new Date())
    ];

    this.branches = [
      new Branch(1, 'Salthill/Knocknacarra'),
      new Branch(2, 'Moycullen'),
      new Branch(3, 'Lackagh')
    ];

    this.entrants = [
      new Entrant(1, 'Eoghan Smith', 1, new Date()),
      new Entrant(2, 'Aoife Doyle', 2, new Date()),
      new Entrant(3, 'Caoimhe O\'Brian', 2, new Date())
    ];
    this.loadComplete = true;
  }

  changeSlip(selection) {
    this.slip = selection;
    this.showForm = false;
    this.counties.sort((a, b) => a.county_name > b.county_name ? 1 : -1);
  }

  changeCounty(county) {
    this.county = county;
    this.showForm = false;
    this.branch = null;
    this.entrant = null;
    if (this.branchRef) this.branchRef.options.forEach((el) => el.deselect());
    this.branches.sort((a, b) => a.branch_name > b.branch_name ? 1 : -1);
  }

  changeBranch(branch) {
    this.branch = branch;
    this.showForm = false;
    this.entrant = null;
    if (this.entrantRef) this.entrantRef.options.forEach((el) => el.deselect());
    this.entrants.sort((a, b) => a.entrant_name > b.entrant_name ? 1 : -1);
  }

  changeEntrant(entrant) {
    this.entrant = entrant;
    this.showForm = false;
  }

  onSubmit() {
    this.showForm = true;
  }
}
