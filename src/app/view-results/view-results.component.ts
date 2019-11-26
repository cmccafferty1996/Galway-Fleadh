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
  displayedColumns: string[] = ['place', 'name', 'branch'];
  results: ResultsTable[];
  dataSource = new MatTableDataSource<ResultsTable>(this.results);

  constructor(private service: ResultsService) { }

  ngOnInit() {
    this.categories = [];
    this.results = [];
    this.service.getAllCategories()
      .then((res: Category[]) => this.categories = res);
  }

  changeCategory(cat) {
    this.category = cat;
    this.initializeTable();
    this.service.getCompetitionByAgeGroup(this.category.id)
      .then((res) => this.competitions = res);
  }

  changeCompetition(comp) {
    this.competition = comp;
    this.initializeTable();
  }

  onSubmit() {
    this.onSubmitClicked = true;
    this.showResults = false;
    this.service.getResultsByCompetition(this.competition.id)
      .then((res: ResultsTable[]) => {
        res.forEach((winner) => {
          this.results.push(winner);
        });
        this.dataSource = new MatTableDataSource<ResultsTable>(this.results);
        this.showResults = true;
      });
  }

  initializeTable() {
    this.showResults = false;
    this.onSubmitClicked = false;
    this.results = [];
  }
}