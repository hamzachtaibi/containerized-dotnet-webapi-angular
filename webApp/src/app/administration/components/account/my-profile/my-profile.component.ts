import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/administration/services/admin.service';
import { AuthService } from 'src/app/administration/services/auth.service';
import { OrgMember } from 'src/app/models/orgMemberModel';
import { PayLoadTokenModel } from 'src/app/models/payLoadTokenModel';
import ValidateForm from 'src/app/repository/Forms/validateform';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {
  title: string = "Mon profil";
  userProfileData!: OrgMember;
  payLoadToken!:PayLoadTokenModel;

  birthDate:string | Date = "";
  registrationDate:string | Date = "";
  profileUpdateTime : string | Date = "";
  gender:string = "";

  updatePasswordForm!: FormGroup;

  constructor(private fb : FormBuilder,
    private adminService : AdminService,
    private authService:AuthService,
    private toastr: ToastrService){}

  ngOnInit(){
    this.payLoadToken = this.authService.decodeToken();
    this.GetProfileById(this.payLoadToken.profileId!);
    this.buildUpdatePasswordForm();
  }


  buildUpdatePasswordForm(){
    this.updatePasswordForm = this.fb.group({
      email : [null, [Validators.required, Validators.email]],
      oldPassword : [null, [Validators.required, ValidateForm.isValidPasssword]],
      newPassword: [null, [Validators.required]]
    });
  }
  //Get profile Data by Id
  GetProfileById(profileId: string) : void{
    this.adminService.getEmployeeById(profileId).subscribe({
      next: (result: OrgMember) => {
        this.userProfileData = result;
        
        if (this.userProfileData.id && profileId === this.userProfileData.id) {

          //set Image
          this.userProfileData.imageProfile = this.userProfileData.imageProfile != null ? `data:image/${this.userProfileData.imageProfile}` : '#';
         
          //Set date value
          this.birthDate = this.userProfileData.birthDate ? this.userProfileData.birthDate : '';
          if(this.birthDate !=='' ){
            this.birthDate = formatDate(this.birthDate, 'dd-MM-yyyy', 'en');
          }
          //Set date value
          this.registrationDate = this.userProfileData.registrationDate ? this.userProfileData.registrationDate : '';
          if(this.registrationDate !=='' ){
            this.registrationDate = formatDate(this.registrationDate, 'dd-MM-yyyy [HH:mm] ', 'en');
          }
          //Set date value
          this.profileUpdateTime = this.userProfileData.profileUpdateTime ? this.userProfileData.profileUpdateTime : '';
          if(this.profileUpdateTime !=='' ){
            this.profileUpdateTime = formatDate(this.profileUpdateTime, 'dd-MM-yyyy [HH:mm]', 'en');
          }
          
          
        }

      },
      error: (er : HttpErrorResponse) => {
        this.title = "Modifier le profil";
        this.toastr.error(er.error.description)
      },
    });

  }

  //Change password
  onChangePassword() :  void{
    if(!this.updatePasswordForm.valid){
      //show notification and error messages
      ValidateForm.validateAllFields(this.updatePasswordForm);
      this.toastr.error("Vérifiez les champs",);
      return;
    }

    console.log("try get values");

    //*****Try to change password *****

    this.authService.changePassword(this.updatePasswordForm.value).subscribe({
      next:(response:any) => {
        //Show notification
        this.toastr.success(response.description);
        // redirect the user to the login page.
        this.authService.logOut();


      },
      error: (er) => {
        //show notification
        this.toastr.error(er.error.description, "Échoué");

      }
    });
    
  }

   //Activate / Deactivate member
  //Call to change profile Status : Active or Inactive
  UpdateStatus(): void {
    //set new STATUS.
    if(confirm("Voulez-vous vraiment désactiver votre compte ?")){
      
    this.userProfileData.isActive = false;
    if (this.userProfileData.id) {

      console.log("try update status");
      console.log(this.userProfileData);
      this.adminService.updateEmployeeById(this.userProfileData.id, this.userProfileData).subscribe({
        next: (result: any) => {
          // Show Notification of success
          this.toastr.success("Votre compte a été désactivé avec succès. ", '',)
          setTimeout(()=>{
            this.authService.logOut();
          }, 3);
        },
        error: (er: HttpErrorResponse) => {
          this.toastr.error("something went wrong", '',)

        },
      });

    }
    }
  }

}
