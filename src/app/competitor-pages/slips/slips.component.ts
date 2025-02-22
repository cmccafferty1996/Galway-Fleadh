import { Component, OnInit, ViewChild } from '@angular/core';
import { County } from '../../models/County';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Branch } from '../../models/branch';
import { Entrant } from '../../models/entrant';
import { MatSelect } from '@angular/material/select';
import { SlipsService } from '../../services/slips.service';
import { UtilsService } from '../../services/utils.service';
import { CoOrdinate } from '../register/register.component';
import { Category } from 'src/app/models/category';
import { Competition } from 'src/app/models/competition';

@Component({
  selector: 'slips',
  templateUrl: './slips.component.html',
  styleUrls: ['./slips.component.css']
})
export class SlipsComponent implements OnInit {

  countyControl = new UntypedFormControl('', [Validators.required]);
  branchControl = new UntypedFormControl('', [Validators.required]);
  entrantControl = new UntypedFormControl('', Validators.required);
  entrantTypeControl = new UntypedFormControl('', Validators.required);
  slipControl = new UntypedFormControl('', Validators.required);
  ageGroupControl = new UntypedFormControl('', [Validators.required]);
  compControl = new UntypedFormControl('', [Validators.required]);
  slip: string;
  entrantType: string;
  county: County;
  branch: Branch;
  entrant: Entrant;
  ageGroup: Category;
  competition: Competition;
  slips: string[] = ['Recording Permit', 'Late Slip', 'Non-Compete Slip'];
  entrantTypes: string[] = ['Solo/Duet/Trio', 'Group'];
  counties: County[];
  branches: Branch[];
  entrants: Entrant[];
  ageGroups: Category[];
  competitions: Competition[];
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
  @ViewChild('entrantTypeRef') entrantTypeRef: MatSelect;
  @ViewChild('catRef') catRef: MatSelect;
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
    this.entrant = null;
    if (this.entrantRef) this.entrantRef.options.forEach((el) => el.deselect());
    this.entrantType = null;
    if (this.entrantTypeRef) this.entrantTypeRef.options.forEach((el) => el.deselect());
    this.competition = null;
    this.ageGroup = null;
    if (this.catRef) this.catRef.options.forEach((el) => el.deselect());
    this.showForm = false;
    if (this.branch && this.slip == 'Late Slip') {
      this.service.getEntrantsByBranch(this.branch.id)
        .then((result: Entrant[]) => {
          this.entrants = result.filter(entrant => !entrant.isGroup);
          this.entrants.sort((a, b) => a.entrant_name > b.entrant_name ? 1 : -1);
        });
    }
  }

  changeCounty(county, loadScreen = false) {
    this.county = county;
    localStorage.setItem('selectedCounty', this.county.county_name);
    this.showForm = false;
    this.branch = null;
    this.entrant = null;
    this.entrantType = null;
    if (this.entrantTypeRef) this.entrantTypeRef.options.forEach((el) => el.deselect());
    this.competition = null;
    this.ageGroup = null;
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
    this.entrant = null;
    this.competition = null;
    this.ageGroup = null;
    if (this.slip == 'Late Slip') {
      if (this.entrantRef) this.entrantRef.options.forEach((el) => el.deselect());
      this.service.getEntrantsByBranch(this.branch.id)
        .then((result: Entrant[]) => {
          this.entrants = result.filter(entrant => !entrant.isGroup);
          this.entrants.sort((a, b) => a.entrant_name > b.entrant_name ? 1 : -1);
        });
    } else {
      this.entrantType = null;
      if (this.entrantTypeRef) this.entrantTypeRef.options.forEach((el) => el.deselect());
      this.entrant = null;
      this.competition = null;
      this.ageGroup = null;
    }
    this.showForm = false;
  }

  changeEntrantType(value) {
    this.entrantType = value;
    this.entrant = null;
    this.competition = null;
    this.ageGroup = null;
    this.showForm = false;

    if (this.entrantType == 'Solo/Duet/Trio') {
      if (this.entrantRef) this.entrantRef.options.forEach((el) => el.deselect());
      this.service.getEntrantsByBranch(this.branch.id)
        .then((result: Entrant[]) => {
          this.entrants = result.filter(entrant => !entrant.isGroup);
          this.entrants.sort((a, b) => a.entrant_name > b.entrant_name ? 1 : -1);
        });
    } else {
      if (this.catRef) this.catRef.options.forEach((el) => el.deselect());
      if (!this.ageGroups) {
        this.service.getAllCategories()
        .then((res) => {
          this.ageGroups = res;
          this.ageGroups.sort((a, b) => a.category > b.category ? 1 : -1);
        });
      }
    }
  }

  changeCategory(value) {
    this.ageGroup = value;
    this.entrant = null;
    this.showForm = false;
    this.competition = null;
    if (this.ageGroup) {
      this.service.getCompetitionsByAgeGroup(this.ageGroup.id)
        .then((res) => {
          this.competitions = res.filter(comp => comp.comp_type == 4);
          this.competitions.sort((a, b) => a.competition_number > b.competition_number ? 1 : -1);
        });
    }
  }

  changeCompetition(value) {
    this.competition = value;
    this.showForm = false;
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
