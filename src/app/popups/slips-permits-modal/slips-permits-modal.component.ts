import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SlipsService } from '../../services/slips.service';
import { SlipsTableRow } from '../../competitor-pages/late-withdrawal-form/late-withdrawal-form.component';
import { SlipComp } from 'src/app/models/SlipComp';

@Component({
  selector: 'app-slips-permits-modal',
  templateUrl: './slips-permits-modal.component.html',
  styleUrls: ['./slips-permits-modal.component.css']
})
export class SlipsPermitsModalComponent implements OnInit {

  displayColumns: string[] = ['Competition Name'];
  tableData: SlipsTableRow[] = [];
  groupTableData: SlipsTableRow[] = [];
  dataSource = new MatTableDataSource<SlipsTableRow>(this.tableData);
  groupDataSource = new MatTableDataSource<SlipsTableRow>(this.groupTableData);
  isLoading = true;
  showErrMessage = false;
  timeString: Date;

  constructor(public dialogRef: MatDialogRef<SlipsPermitsModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, private service: SlipsService) { }

  ngOnInit(): void {
    if (this.data.row.entrantIds && this.data.row.entrantIds.length > 0) {
      this.service.getCompetitionsByEntrant(this.data.row.entrantIds, this.data.slipType)
      .then((res) => {
        if (res.length > 0) {
          res.forEach((comp) => {
            const currentCategory = this.data.categories.find((cat) => cat.id == comp.ageGroup);
            this.tableData.push(
              new SlipsTableRow(comp.entryId, null, currentCategory.category + ' ' + currentCategory.age_group, comp.competitionName)
            );
          });
          this.tableData = this.tableData.filter(
            row => row.ageGroup != this.data.ageGroup && row.competition != this.data.competition
          );
          this.dataSource = new MatTableDataSource<SlipsTableRow>(this.tableData);

          if (this.data.groups && this.data.groups.length > 0) {
            this.data.groups.forEach((group: SlipComp) => {
              const currentGroupCategory = this.data.categories.find((cat) => cat.id == group.ageGroup);
              this.groupTableData.push(
                new SlipsTableRow(group.entryId, null, currentGroupCategory.category + ' ' + currentGroupCategory.age_group, group.competitionName)
              );
            });
            this.groupDataSource = new MatTableDataSource<SlipsTableRow>(this.groupTableData);
          }
          this.timeString = new Date(this.data.row.createTime);
          this.isLoading = false;
        }
      })
      .catch((err) => {
        console.log('Error getting entrant competitions', err);
        this.isLoading = false;
        this.showErrMessage = true;
      });
    } else {
      this.isLoading = false;
      this.showErrMessage = true;
    }
  }

  close(param?): void {
    this.dialogRef.close(param);
  }
}
