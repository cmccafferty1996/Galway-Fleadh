import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './competitor-pages/register/register.component';
import { ViewResultsComponent } from './competitor-pages/view-results/view-results.component';
import { LoginComponent } from './admin-pages/login/login.component';
import { ManageResultsComponent } from './admin-pages/manage-results/manage-results.component';
import { ManageRegistrationComponent } from './admin-pages/manage-registration/manage-registration.component';
import { SlipsComponent } from './competitor-pages/slips/slips.component';
import { ManageSlipsComponent } from './admin-pages/manage-slips/manage-slips.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component:  HomeComponent},
  { path: 'register', component:  RegisterComponent},
  { path: 'results', component: ViewResultsComponent},
  { path: 'slips', component: SlipsComponent},
  { path: 'login', component: LoginComponent},
  { path: 'manage-results', component: ManageResultsComponent},
  { path: 'manage-reg', component: ManageRegistrationComponent},
  { path: 'manage-slips', component: ManageSlipsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
