import { Component, OnInit, ViewChild } from '@angular/core';
import { County } from '../../models/County';
import { FormControl, Validators } from '@angular/forms';
import { Branch } from '../../models/branch';
import { Entrant } from '../../models/entrant';
import { MatSelect } from '@angular/material/select';
import { SlipsService } from '../../services/slips.service';
import { UtilsService } from '../../services/utils.service';
import { CoOrdinate } from '../register/register.component';

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
  today = new Date();
  venue: CoOrdinate;
  venueDistance: number;
  onSubmitClicked = false;
  abadonShip = false;
  loadComplete = false;
  showForm = false;
  isTooFarFromVenue: boolean = false;
  isTooEarly: boolean = false;
  isLocationDisabled: boolean = false;

  @ViewChild('countyRef') countyRef: MatSelect;
  @ViewChild('branchRef') branchRef: MatSelect;
  @ViewChild('entrantRef') entrantRef: MatSelect;
  compareCounty = UtilsService.compareCounty;

  constructor(private service: SlipsService) { }

  ngOnInit(): void {
    this.today.setHours(0, 0, 0, 0);
    this.service.getAllCountyNames()
      .then((res) => {
        this.counties = res;
        this.counties.sort((a, b) => a.county_name > b.county_name ? 1 : -1);
        this.county = UtilsService.getCountyFromLocalStorage(this.counties);
        if (this.county !== null && this.county !== undefined) {
          this.changeCounty(this.county, true);
        } else {
          this.loadComplete = true;
        }
      })
      .catch((err) => {
        this.abadonShip = true;
        console.log('No counties retrieved', err);
      });
  }

  changeSlip(selection) {
    this.slip = selection;
    this.showForm = false;
  }

  changeCounty(county, loadScreen = false) {
    this.county = county;
    localStorage.setItem('selectedCounty', this.county.county_name);
    this.showForm = false;
    this.branch = null;
    this.entrant = null;
    if (this.branchRef) this.branchRef.options.forEach((el) => el.deselect());
    this.service.getBranchesByCounty(this.county.id)
      .then((res) => {
        this.branches = res;
        this.branches.sort((a, b) => a.branch_name > b.branch_name ? 1 : -1);
        if (loadScreen) this.loadComplete = true;
      });
    this.getVenueLocation();
  }

  getVenueLocation() {
    this.service.getVenueLocation(this.county.id)
      .then((res) => {
        this.venue = new CoOrdinate(res[0].latitude, res[0].longitude);
        this.venueDistance = res[0].distance;
      })
      .catch((err) => {
        this.venue = null;
        this.venueDistance = -1;
        console.log('Error getting venue location', err);
      });
  }

  changeBranch(branch) {
    this.branch = branch;
    this.showForm = false;
    this.entrant = null;
    if (this.entrantRef) this.entrantRef.options.forEach((el) => el.deselect());
    this.service.getEntrantsByBranch(this.branch.id)
      .then((result: Entrant[]) => {
        this.entrants = result;
        this.entrants.sort((a, b) => a.entrant_name > b.entrant_name ? 1 : -1);
      });
  }

  radioSelection(value) {
    console.log('radio selection', value);
  }

  changeEntrant(entrant) {
    this.entrant = entrant;
    this.showForm = false;
  }

  onSubmit() {
    if (UtilsService.isCompDateToday(this.county.fleadh_date, this.today)) {
      UtilsService.isUserAtTheVenue(this.venue, this.venueDistance)
        .then((result) => {
          if (result) {
            this.isTooFarFromVenue = false;
            this.showForm = true;
          } else {
            this.isTooFarFromVenue = true;
          }
        })
        .catch((err) => {
          this.isLocationDisabled = true;
          console.log('Error in getCurrentPosition: '+ err);
        });
    } else {
      this.isTooEarly = true;
    }
  }
}
