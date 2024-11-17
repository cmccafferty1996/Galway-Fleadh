import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SlipsTableRow } from '../../competitor-pages/late-withdrawal-form/late-withdrawal-form.component';

@Component({
  selector: 'app-confirm-slip',
  templateUrl: './confirm-slip.component.html',
  styleUrls: ['./confirm-slip.component.css']
})
export class ConfirmSlipComponent implements OnInit {

  slipsToCreate: SlipsTableRow[] = [];
  
  constructor(public dialogRef: MatDialogRef<ConfirmSlipComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
  }

  ngOnInit(): void {
    if (this.data.slips) {
      this.slipsToCreate = this.data.slips.filter((row) => row.isChecked && !row.slipExists);
      console.log('slips count', this.slipsToCreate.length);
    }
  }

  close(param?): void {
    this.dialogRef.close(param);
  }

}
