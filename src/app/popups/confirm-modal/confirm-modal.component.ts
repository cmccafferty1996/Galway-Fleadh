import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entrant } from '../../models/entrant';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  buttonText = 'Register';
  registerEntrants: Entrant[];
  unregisterEntrants: Entrant[];
  isDelete = false;

  constructor(public dialogRef: MatDialogRef<ConfirmModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.unregisterEntrants = [];
    if (this.data.isManageReg) {
      this.buttonText = 'Update';
    } else if (this.data.isDelete) {
      this.isDelete = true;
      this.buttonText = 'Delete';
    }
    if (this.data.entrants) {
      this.registerEntrants = this.data.entrants.filter((entrant) => entrant.isRegistered== true);
      this.unregisterEntrants = this.data.entrants.filter((entrant) => entrant.isRegistered== false);
    }
  }

  close(param?): void {
    this.dialogRef.close(param);
  }
}
