import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/administration/services/admin.service';
import { Needy } from 'src/app/models/needyModel';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent {
  title: string = "Détails du profil";

  profileId: string | null;
  needyProfileData!: Needy;
  birthDate:string | Date = "";
  registrationDate:string | Date = "";
  profileUpdateTime : string | Date = "";
  gender:string = "";
  maritalStatus:string = "";

  settingsForm!:FormGroup; //Settings Form

  /*Not Found Config*/
  showButton:boolean = true;
  bigTitle : string = "Sorry, an error has occured, Requested Profile not found!";
  indications="Could be removed";
  showNotFound:boolean = false;


  constructor(
    private url: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.profileId = this.url.snapshot.paramMap.get("id") ? this.url.snapshot.paramMap.get("id") : null;
  };

  ngOnInit(){
    //if url has an Id --> updating a profile.
    if (this.profileId && this.profileId.length > 0) {
      this.buildSettingsForm();
      this.GetProfileById(this.profileId); //Fill the Form / or show Not Found
    } else {
      this.showNotFound = false;
    }
  }


  //Setting Form
  buildSettingsForm(){
    this.settingsForm = new FormGroup({
      isActive : new FormControl()
    });
  }
  //Get profile Data by Id
  GetProfileById(profileId: string) : void{
    this.adminService.getNeedyById(profileId).subscribe({
      next: (result: Needy) => {
        this.needyProfileData = result;
        
        if (this.needyProfileData.id && this.needyProfileData.id.length > 0) {
          this.showNotFound = false;

          //set Image
          this.needyProfileData.imageProfile = this.needyProfileData.imageProfile != '' ? `data:image/${this.needyProfileData.imageProfile}` : '../../../../../assets/img/profileUserIcon.png';
         
          //Set date value
          this.birthDate = this.needyProfileData.birthDate ? this.needyProfileData.birthDate : '';
          if(this.birthDate !=='' ){
            this.birthDate = formatDate(this.birthDate, 'dd-MM-yyyy', 'en');
          }
          //Set date value
          this.registrationDate = this.needyProfileData.registrationDate ? this.needyProfileData.registrationDate : '';
          if(this.registrationDate !=='' ){
            this.registrationDate = formatDate(this.registrationDate, '[HH:mm] dd-MM-yyyy', 'en');
          }
          //Set date value
          this.profileUpdateTime = this.needyProfileData.profileUpdateTime ? this.needyProfileData.profileUpdateTime : '';
          if(this.profileUpdateTime !=='' ){
            this.profileUpdateTime = formatDate(this.profileUpdateTime, '[HH:mm] dd-MM-yyyy', 'en');
          }
          //Set profile Status.
          this.settingsForm.patchValue({isActive: this.needyProfileData.isActive});
          //Set gender
          switch (this.needyProfileData.gender){
            case "F":
              this.gender = "Femelle / أنثى";
              break;
            case "M":
              this.gender = "Mâle / ذكر";
              break;
            default:
              this.gender = "N/A"
          }
          //Set maritalStatus
          switch (this.needyProfileData.maritalStatus){
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
      error: (er : HttpErrorResponse) => {
        this.title = "Modifier le profil";
        this.showNotFound = true;
        this.toastr.error(er.error.description)
      },
    });

  }

  //Call to delete profile data from DB
  DeleteProfile(): void {
    if(confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')){
      this.adminService.deleteNeedyProfile(this.profileId!).subscribe({
        next: (result: any) => {
          //show notification
          this.toastr.success("Profil supprimé avec succès", '');
          //redirect to Profile list Page
          setTimeout(() => { this.router.navigate([`dashboard/profileList`]); }, 0);

        },
        error: (er: HttpErrorResponse) => {
          this.toastr.error(er.error.description);
        }
      });
    }

    
  }
  
  //Call to update profile eetings
  UpdateProfileSettings() : void{
    // Get form Values.
    const dataToSubmit = this.settingsForm.value;
    console.log(dataToSubmit);
    // map/merge
    this.needyProfileData = { ...this.needyProfileData, ...dataToSubmit };

    //try update profile settings
    if(this.needyProfileData.id){
      this.adminService.updateNeedyById(this.needyProfileData.id, this.needyProfileData).subscribe({
        next: (result: any) => {
          // Show Notification of success
          this.toastr.success("Settings modifié avec succès.", '',)
        },
        error: (er : HttpErrorResponse) => {
          this.toastr.error(er.error.description, '',)
  
        },
      });

    }
  }

}
