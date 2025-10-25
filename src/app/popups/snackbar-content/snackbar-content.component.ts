import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-snackbar-content',
    templateUrl: './snackbar-content.component.html',
    styleUrls: ['./snackbar-content.component.css'],
    standalone: false
})
export class SnackbarContentComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
