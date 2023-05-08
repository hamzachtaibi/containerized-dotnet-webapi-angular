import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AdministrationModule } from '../administration/administration.module';




@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    DashboardRoutingModule,
    HttpClientModule,

    SharedModule,
    AdministrationModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
