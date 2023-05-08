import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/account/login/login.component';
import { RegistrationComponent } from './components/account/registration/registration.component';
import { UpsertProfileComponent } from './components/needy/upsert-profile/upsert-profile.component';
import { ViewProfileComponent } from './components/needy/view-profile/view-profile.component';
import { ProfilesListComponent } from './components/needy/profiles-list/profiles-list.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { MyProfileComponent } from './components/account/my-profile/my-profile.component';
import { MembersListComponent } from './components/organization/members-list/members-list.component';
import { AddMemberComponent } from './components/organization/add-member/add-member.component';
import { ViewMemberComponent } from './components/organization/view-member/view-member.component';
import { FaqComponent } from './components/faq/faq.component';
import { SuperAdminComponent } from './components/account/super-admin/super-admin.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    UpsertProfileComponent,
    ViewProfileComponent,
    ProfilesListComponent,
    MyProfileComponent,
    MembersListComponent,
    AddMemberComponent,
    ViewMemberComponent,
    FaqComponent,
    SuperAdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,

    //Project Modules
    SharedModule

  ],
  exports:[
    LoginComponent,
    RegistrationComponent,
    UpsertProfileComponent,
    ViewProfileComponent,
    ProfilesListComponent,
    MyProfileComponent,
    MembersListComponent,
    AddMemberComponent,
    ViewMemberComponent,
  ]
})
export class AdministrationModule { }
