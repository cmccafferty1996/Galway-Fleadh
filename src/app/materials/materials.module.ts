import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule, 
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatTabsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatPaginatorModule,
        MatTableModule,
        MatCheckboxModule} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule 
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule 
  ]
})
export class MaterialsModule {}
