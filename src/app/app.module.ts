import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MaterialsModule } from './materials/materials.module';
import { RegisterComponent } from './register/register.component';
import { ViewResultsComponent } from './view-results/view-results.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ManageResultsComponent } from './manage-results/manage-results.component';
import { ManageRegistrationComponent } from './manage-registration/manage-registration.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { SnackbarContentComponent } from './snackbar-content/snackbar-content.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    ViewResultsComponent,
    LoginComponent,
    ManageResultsComponent,
    ManageRegistrationComponent,
    ConfirmModalComponent,
    SnackbarContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmModalComponent, SnackbarContentComponent]
})
export class AppModule { }
