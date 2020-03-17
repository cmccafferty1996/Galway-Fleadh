import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { Category } from '../models/category';
import { ResultsService } from '../services/results.service';
import { Competition } from '../models/competition';

export class ResultsTable {

  place: String;
  name: String;
  branch: String;

  constructor(pl: String, nm: String, br: String) {
    this.place = pl;
    this.name = nm;
    this.branch = br;
  }
}

@Component({
  selector: 'app-view-results',
  templateUrl: './view-results.component.html',
  styleUrls: ['./view-results.component.css']
})
export class ViewResultsComponent implements OnInit {

  categoryControl = new FormControl('', [Validators.required]);
  selectFormControl = new FormControl('', Validators.required);
  category: Category;
  competition: Competition;
  categories: Category[];
  competitions: Competition[];
  today = new Date();
  showResults = false;
  onSubmitClicked = false;
  showResultsError = false;
  abadonShip = false;
  loadComplete = false;
  displayedColumns: string[] = ['place', 'name', 'branch'];
  results: ResultsTable[];
  dataSource = new MatTableDataSource<ResultsTable>(this.results);

  constructor(private service: ResultsService) { }

  ngOnInit() {
    this.categories = [];
    this.results = [];
    this.service.getAllCategories()
      .then((res: Category[]) => {
        this.categories = res;
        this.loadComplete = true;
      })
      .catch((err) => {
        this.abadonShip = true;
        console.log('Error getting categories ', err);
      })
  }

  changeCategory(cat) {
    this.category = cat;
    this.competition = null;
    this.initializeTable();
    this.service.getCompetitionByAgeGroup(this.category.id)
      .then((res) => {
        this.competitions = res;
        this.competitions.sort((a, b) => a.competition_name > b.competition_name ? 1 : -1);
      });
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.initializeTable();
  }

  onSubmit() {
    this.onSubmitClicked = true;
    this.showResults = false;
    this.showResultsError = false;
    this.service.getResultsByCompetition(this.competition.id)
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