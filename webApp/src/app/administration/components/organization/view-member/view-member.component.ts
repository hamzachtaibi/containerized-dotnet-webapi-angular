import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/administration/services/admin.service';
import { AuthService } from 'src/app/administration/services/auth.service';
import { OrgMember } from 'src/app/models/orgMemberModel';
import { PayLoadTokenModel } from 'src/app/models/payLoadTokenModel';

@Component({
  selector: 'app-view-member',
  templateUrl: './view-member.component.html',
  styleUrls: ['./view-member.component.css']
})

export class ViewMemberComponent {
  title: string = "Profil du membre";
  payLoadToken!: PayLoadTokenModel;
  memberId: string | null;
  memberProfileData!: OrgMember;
  isMember:boolean= true;

  /*Not Found Config*/
  showButton: boolean = true;
  bigTitle: string = "Sorry, an error has occured, Requested Member not found!";
  indications = "Could be removed";
  showNotFound: boolean = false;

  birthDate: string | Date = "";
  registrationDate: string | Date = "";
  profileUpdateTime: string | Date = "";
  gender: string = "";

  settingsForm! : FormGroup;

  constructor(
    private url: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private toastr: ToastrService,
    private fb : FormBuilder
  ) {
    this.memberId = this.url.snapshot.paramMap.get("id") ? this.url.snapshot.paramMap.get("id") : null;

  };

  ngOnInit() {
    //if url has an Id --> updating a profile.
    if (this.memberId && this.memberId.length > 0) {
      console.log(this.memberId);
      
      this.payLoadToken = this.authService.decodeToken();
      this.buildSettingsForm();
      this.GetProfileById(this.memberId); //Fill the Form / or show Not Found

    } else {
      this.showNotFound = false;
    }
    
    console.log(this.memberProfileData.role);
  }


  buildSettingsForm(){
    this.settingsForm = this.fb.group({
      id : [null],
      role : [null],
      email : [null]
    });
  }


  //Get profile Data by Id
  GetProfileById(profileId: string): void {
    console.log(profileId);
    this.adminService.getEmployeeById(profileId).subscribe({
      next: (result: OrgMember) => {
        this.memberProfileData = result;
        console.log("hello member")
        console.log(this.memberProfileData);

        if (this.memberProfileData.id && profileId === this.memberProfileData.id) {
          this.showNotFound = false;
          this.isMember = this.memberProfileData.role == "member" ? true :  false;
          this.settingsForm.patchValue({
            id:this.memberProfileData.id,
            role: this.memberProfileData.role,
            email:this.memberProfileData.email,
          });
          //set Image
          this.memberProfileData.imageProfile = this.memberProfileData.imageProfile == '' ? '../../../../../assets/img/profileUserIcon.png' : `data:image/${this.memberProfileData.imageProfile}`;

          //Set date value
          this.birthDate = this.memberProfileData.birthDate ? this.memberProfileData.birthDate : '';
          if (this.birthDate !== '') {
            this.birthDate = formatDate(this.birthDate, 'dd-MM-yyyy', 'en');
          }
          //Set date value
          this.registrationDate = this.memberProfileData.registrationDate ? this.memberProfileData.registrationDate : '';
          if (this.registrationDate !== '') {
            this.registrationDate = formatDate(this.registrationDate, 'dd-MM-yyyy [HH:mm] ', 'en');
          }
          //Set date value
          this.profileUpdateTime = this.memberProfileData.profileUpdateTime ? this.memberProfileData.profileUpdateTime : '';
          if (this.profileUpdateTime !== '') {
            this.profileUpdateTime = formatDate(this.profileUpdateTime, 'dd-MM-yyyy [HH:mm]', 'en');
          }
          //Set gender
          switch (this.memberProfileData.gender) {
            case "F":
              this.gender = "Femelle / أنثى";
              break;
            case "M":
              this.gender = "Mâle / ذكر";
              break;
            default:
              this.gender = "N/A"
          }


        }

      },
      error: (er: HttpErrorResponse) => {
        this.showNotFound = true;
        this.title = "Modifier le profil";
        this.toastr.error(er.error.description)
      },
    });

  }


  //Activate / Deactivate member
  //Call to change profile Status : Active or Inactive
  UpdateStatus(): void {
    if(confirm("es-tu sûr ?")){
      
    //set new STATUS.
    this.memberProfileData.isActive = this.memberProfileData.isActive ? false : true;

    console.log(this.memberProfileData);
    if (this.memberProfileData.id) {

      console.log("try update status");
      console.log(this.memberProfileData);
      this.adminService.updateEmployeeById(this.memberProfileData.id, this.memberProfileData).subscribe({
        next: (result: any) => {
          // Show Notification of success
          this.toastr.success(this.memberProfileData.isActive ? "profil utilisateur activé avec succès." : "profil utilisateur désactivé avec succès", '',)
        },
        error: (er: HttpErrorResponse) => {
          this.toastr.error("something went wrong", '',)

        },
      });

    }
    }
  }

  onChangeSetting() {
    if (this.memberProfileData.id) {

      console.log("try update status");
      console.log(this.settingsForm.value);
      this.adminService.changeUserRole(this.payLoadToken.email!, this.settingsForm.value).subscribe({
        next: (result: any) => {
          // Show Notification of success
          this.toastr.success("Rôle d'utilisateur modifié", '',)
          //reload data
          this.GetProfileById(this.memberProfileData.id!);
        },
        error: (er: HttpErrorResponse) => {
          this.toastr.error(er.error.description, '',)
          console.log(er);

        },
      });

    }
  }

  //Call to delete profile data from DB
  DeleteUserAccount(): void {
    console.log(this.memberProfileData);
    if (confirm("Voulez-vous vraiment supprimer ce membre ?")) {
      this.adminService.deleteUserAccount(this.memberProfileData.id!, this.memberProfileData.role!, this.payLoadToken.role!).subscribe({
        next: (result: any) => {
          //show notification
          this.toastr.success("Account supprimé avec succès", '');
          //redirect to member list Page
          setTimeout(() => { this.router.navigate([`members`]); }, 0);

        },
        error: (er: HttpErrorResponse) => {
          this.toastr.error(er.error.description);
        }
      });
    }


  }

}
