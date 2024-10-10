import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Competition } from '../../models/competition';

@Component({
  selector: 'app-slips-permits-modal',
  templateUrl: './slips-permits-modal.component.html',
  styleUrls: ['./slips-permits-modal.component.css']
})
export class SlipsPermitsModalComponent implements OnInit {

  displayColumns: string[] = ['Competition Name'];
  tableData: Competition[] = [];
  dataSource = new MatTableDataSource<Competition>(this.tableData);

  constructor(public dialogRef: MatDialogRef<SlipsPermitsModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    if (this.data.entrantComps) {
      console.log('here', this.data.entrantComps);
      this.tableData = this.data.entrantComps;
      this.dataSource = new MatTableDataSource<Competition>(this.tableData);
    }
  }

  close(param?): void {
    this.dialogRef.close(param);
  }
}
