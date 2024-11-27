import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../../models/category';
import { ResultsService } from '../../services/results.service';
import { Competition } from '../../models/competition';
import { County } from '../../models/County';
import { MatSelect } from '@angular/material/select';
import { UtilsService } from '../../services/utils.service';

export class ResultsTable {

  place: String;
  name: String;
  instruments: String;
  branch: String;

  constructor(pl: String, nm: String, instr: String, br: String) {
    this.place = pl;
    this.name = nm;
    this.instruments = instr;
    this.branch = br;
  }
}

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.css']
})
export class ViewResultsComponent implements OnInit {
  countyControl = new UntypedFormControl('', [Validators.required]);
  categoryControl = new UntypedFormControl('', [Validators.required]);
  selectFormControl = new UntypedFormControl('', Validators.required);
  county: County;
  category: Category;
  competition: Competition;
  counties: County[];
  categories: Category[];
  competitions: Competition[];
  today = new Date();
  showResults = false;
  onSubmitClicked = false;
  showResultsError = false;
  abadonShip = false;
  loadComplete = false;
  isComhraGaeilge = false;
  displayedColumns: string[] = ['place', 'name', 'branch'];
  results: ResultsTable[] = [];
  dataSource = new MatTableDataSource<ResultsTable>(this.results);

  @ViewChild('catRef') catRef: MatSelect;
  compareCounty = UtilsService.compareCounty;

  constructor(private service: ResultsService) { }

  ngOnInit() {
    this.counties = [];
    this.categories = [];
    this.results = [];
    this.service.getAllCountyNames()
      .then((res: County[]) => {
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
        console.log('Error getting counties ', err);
      })
  }

  changeCounty(county, loadScreen = false) {
    this.county = county;
    localStorage.setItem('selectedCounty', this.county.county_name);
    this.initializeTable();
    this.competition = null;
    this.category = null;
    if (this.catRef) this.catRef.options.forEach((el) => el.deselect());
    if (!this.categories || this.categories.length === 0) {
      this.service.getAllCategories()
        .then((res) => {
          this.categories = res;
          this.categories.sort((a, b) => a.category > b.category ? 1 : -1);
          if (loadScreen) this.loadComplete = true;
        });
    }
  }

  changeCategory(cat) {
    this.category = cat;
    this.competition = null;
    this.initializeTable();
    if (this.category) this.service.getCompetitionByAgeGroup(this.category.id)
      .then((res) => {
        this.competitions = res;
        this.competitions.sort((a, b) => a.competition_number > b.competition_number ? 1 : -1);
      });
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.isComhraGaeilge = this.competition.comp_type === 6;
    this.initializeTable();
  }

  onSubmit() {
    this.onSubmitClicked = true;
    this.showResults = false;
    this.showResultsError = false;
    this.service.getResults(this.competition.id, this.county.id)
      .then((res: ResultsTable[]) => {
        res.forEach((winner) => {
          this.results.push(winner);
        });
        this.dataSource = new MatTableDataSource<ResultsTable>(this.results);
        this.showResults = true;
        window.scrollTo(0, document.body.scrollHeight);
      })
      .catch(() => {
        this.showResultsError = true;
      });
  }

  initializeTable() {
    this.showResults = false;
    this.onSubmitClicked = false;
    this.results = [];
    this.showResultsError = false;
  }
}