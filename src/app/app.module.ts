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
import { SlipsComponent } from './slips/slips.component';
import { LateWithdrawalFormComponent } from './late-withdrawal-form/late-withdrawal-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ManageSlipsComponent } from './manage-slips/manage-slips.component';
import { SlipsPermitsModalComponent } from './slips-permits-modal/slips-permits-modal.component';

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
    SnackbarContentComponent,
    SlipsComponent,
    LateWithdrawalFormComponent,
    ManageSlipsComponent,
    SlipsPermitsModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmModalComponent, SnackbarContentComponent]
})
export class AppModule { }
