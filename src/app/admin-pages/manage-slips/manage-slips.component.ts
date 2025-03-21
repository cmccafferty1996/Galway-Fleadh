import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Competition } from '../../models/competition';
import { County } from '../../models/County';
import { UntypedFormControl, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SlipsPermitsModalComponent } from '../../popups/slips-permits-modal/slips-permits-modal.component';
import { SlipsService } from '../../services/slips.service';
import { UtilsService } from '../../services/utils.service';
import { Slip } from '../../models/Slip';
import { SlipComp } from 'src/app/models/SlipComp';
import { LoginService } from 'src/app/services/login.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

export class DropDownSlip {
  label: string;
  slipType: number;

  constructor(text: string, type: number) {
    this.label = text;
    this.slipType = type;
  }
}

@Component({
  selector: 'manage-slips',
  templateUrl: './manage-slips.component.html',
  styleUrls: ['./manage-slips.component.css']
})
export class ManageSlipsComponent implements OnInit {

  countyControl = new UntypedFormControl('', [Validators.required]);
  categoryControl = new UntypedFormControl('', [Validators.required]);
  competitionControl = new UntypedFormControl('', Validators.required);
  slipControl = new UntypedFormControl('', Validators.required);
  slip: DropDownSlip;
  county: County;
  category: Category;
  competition: Competition;
  slips: DropDownSlip[] = [
    new DropDownSlip('Late Slip', 1), new DropDownSlip('Non-Compete Slip', 2),
    new DropDownSlip('Recording Permit', 3)
  ];
  counties: County[];
  categories: Category[];
  competitions: Competition[];
  lateSlipColumns: string[] = ['Competitor Name', 'Notified By', 'Contact Number'];
  nonCompeteSlipColumns: string[] = ['Competitor Name', 'Notified By'];
  recordingPermitColumns: string[] = ['Competitor Name', 'Requester Name'];
  tableData: Slip[] = [];
  dataSource = new MatTableDataSource<Slip>(this.tableData);
  subscription: Subscription;
  showSlips = false;
  abadonShip = false;
  loadComplete = false;
  isLoggedIn = false;
  isLoginCheckDone = false;
  isLoading = false;
  isViewMode = false;
  isCreateMode = false;

  @ViewChild('catRef') catRef: MatSelect;
  @ViewChild('compRef') compRef: MatSelect;
  compareCounty = UtilsService.compareCounty;

  constructor(public dialog: MatDialog, private service: SlipsService,  private login: LoginService) { }

  ngOnInit(): void {
    this.subscription = this.login.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res.isLoggedIn;
      this.isLoginCheckDone = true;
      this.loadComplete = !this.isLoggedIn;
    });
  }

  showViewMode() {
    this.isCreateMode = false;
    this.isViewMode = true;
    this.slip = null;
    this.category = null;
    this.showSlips = false;
    this.competition = null;
    if (this.compRef) this.compRef.options.forEach((el) => el.deselect());
    this.categoryControl.reset();
    this.slipControl.reset();
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

  showCreateMode() {
    this.isCreateMode = true;
    this.isViewMode = false;
    this.loadComplete = true;
  }

  changeSlip(selection) {
    this.slip = selection;
    this.showSlips = false;
  }

  changeCounty(county, loadScreen) {
    this.county = county;
    localStorage.setItem('selectedCounty', this.county.county_name);
    this.showSlips = false;
    if (this.categories != undefined) return;
    this.service.getAllCategories()
      .then((res) => {
        this.categories = res;
        this.categories.sort((a, b) => a.category > b.category ? 1 : -1);
        if (loadScreen) this.loadComplete = true;
      })
  }

  changeCategory(cat) {
    this.category = cat;
    this.showSlips = false;
    this.competition = null;
    if (this.compRef) this.compRef.options.forEach((el) => el.deselect());
    this.service.getCompetitionsByAgeGroup(this.category.id)
      .then((res) => {
        this.competitions = res;
        this.competitions.sort((a, b) => a.competition_number > b.competition_number ? 1 : -1);
      });
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.showSlips = false;
  }

  searchSlips() {
    this.isLoading = true;
    this.tableData = [];
    this.service.getSlipsByType(this.competition.id, this.county.id, this.slip.slipType)
      .then((res) => {
        if (res.length > 0) {
          res.forEach((slip) => {
            this.tableData.push(new Slip(
              this.slip.slipType,
              slip.entryId, slip.submittedBy, slip.teleNo, slip.email,
              slip.address1, slip.address2, slip.address3, slip.address4, slip.id,
              slip.entrantNames, slip.entrantIds, slip.createTime
            ));
          });
        }
        this.dataSource = new MatTableDataSource<Slip>(this.tableData);
        this.isLoading = false;
        this.showSlips = true;
      })
      .catch(err => {
        console.log('No slips found', err);
        this.isLoading = false;
        this.showSlips = true;
      });
  }

  openDialog(rowData: Slip) {
    this.service.getSlipGroups(rowData.id)
      .then((res: SlipComp[]) => {
        this.dialog.open(SlipsPermitsModalComponent, {
          width: '750px',
          height: '500px',
          data: {
            title: this.slip.label,
            slipType: this.slip.slipType,
            ageGroup: this.category.age_group,
            competition: this.competition.competition_name,
            groups: res,
            categories: this.categories,
            row: rowData
          }
        });
      });
  }
}
