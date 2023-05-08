import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './administration/components/account/login/login.component';
import { RegistrationComponent } from './administration/components/account/registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { MyProfileComponent } from './administration/components/account/my-profile/my-profile.component';
import { ProfilesListComponent } from './administration/components/needy/profiles-list/profiles-list.component';
import { ViewProfileComponent } from './administration/components/needy/view-profile/view-profile.component';
import { UpsertProfileComponent } from './administration/components/needy/upsert-profile/upsert-profile.component';
import { MembersListComponent } from './administration/components/organization/members-list/members-list.component';
import { AddMemberComponent } from './administration/components/organization/add-member/add-member.component';
import { ViewMemberComponent } from './administration/components/organization/view-member/view-member.component';
import { AuthGuard } from './repository/guards/auth.guard';
import { FaqComponent } from './administration/components/faq/faq.component';
import { RoleGuard } from './repository/guards/role.guard';
import { SuperAdminComponent } from './administration/components/account/super-admin/super-admin.component';

const routes: Routes = [
  { path: "superAdmin", component:SuperAdminComponent},
  { path: "login", component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  {
    path: "dashboard", component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'myProfile', component: MyProfileComponent},

      { path: "profileList", component: ProfilesListComponent},
      { path: "profileDetails/:id", component: ViewProfileComponent},
      { path: "profile/add", component: UpsertProfileComponent},
      { path: "profile/edit/:id", component: UpsertProfileComponent},

      { path: "members",
        component: MembersListComponent,
        canActivate: [RoleGuard],
        data:{allowedRoles: ['admin', 'superAdmin']},
      },
      { path: "member/add", component: AddMemberComponent,
        canActivate: [RoleGuard],
        data:{allowedRoles: ['admin', 'superAdmin']},
      },
      { path: "member/edit/:id", component: AddMemberComponent,
        canActivate: [RoleGuard],
        data:{allowedRoles: ['admin', 'superAdmin']},
      },
      { path: "member/profile/:id", component: ViewMemberComponent,
        canActivate: [RoleGuard],
        data:{allowedRoles: ['admin', 'superAdmin']},
      },
      {path: "help", component:FaqComponent},
      {path:'', redirectTo: 'profileList', pathMatch: 'full'},
    ]
  },

  { path:'', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: "**", redirectTo: "dashboard", pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
