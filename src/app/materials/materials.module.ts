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
        MatCheckboxModule,
        MatInputModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatListModule} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatListModule
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
    MatCheckboxModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatListModule
  ]
})
export class MaterialsModule {}
