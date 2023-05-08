import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/administration/services/admin.service';
import { OrgMember } from 'src/app/models/orgMemberModel';
import ValidateForm from 'src/app/repository/Forms/validateform';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent {


  @ViewChild('RefpreviewImageMain') previewImageMain!: ElementRef;
  @ViewChild('RefimageLabelNameMain') imageLabelNameMain!: ElementRef;
  @ViewChild('RefimageUploaderMain') imageUploaderMain!: ElementRef;
  @ViewChild('RefbtnUploadMain') btnUploadMain!: ElementRef;
  showBtnDeleteImgMain: boolean = false;
  profileImageMain?: string | null;

  @ViewChild('RefImagePreviewAnony') previewImageAnony!: ElementRef;
  @ViewChild('RefimageUploaderAnony') imageUploaderAnony!: ElementRef;
  @ViewChild('RefbtnUploadAnony') btnUploadAnony!: ElementRef;
  showBtnDeleteImgAnony: boolean = false;
  profileImageAnony?: string | null;


  title: string = "Ajouter un nouveau membre";
  /*Not Found page*/
  showNotFound: boolean = false;
  showButton: boolean = true;
  bigTitle: string = "Désolé, une erreur s'est produite, le membre demandé n'a pas été trouvé !";
  indications = "Peut être supprimé";
  /*End Not Found page*/

  @Input() isChild!: boolean;
  @Input() userProfileId!:string;
  @Input() isActive!: boolean;
  profileForm!: FormGroup;
  maritalStatus: string[] = ["Célibataire", "Marié(e)", "Veuf/Veuve", "Divorcé(e)"];
  profileId: string | null;
  registrationDate!: Date | null;
  textBtn: string = "Ajouter";




  constructor(
    private url: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.profileId = this.url.snapshot.paramMap.get("id") ? this.url.snapshot.paramMap.get("id") : null;
  };

  ngOnInit() {
    if(this.isChild){
      this.profileId = this.userProfileId;
    }
    console.log(`from init : ${this.profileId}`);
    this.BuildForm();
    //if url has an Id --> updating a profile.
    if (this.profileId && this.profileId.length > 0) {
      this.GetProfileById(this.profileId); //Fill the Form / or show Not Found
    } else {
      this.textBtn = "Ajouter";
      this.showNotFound = false;
      this.isChild = false;
    }
  }




  /**********************************
 *  Methods
 **********************************/

  //Build Form
  BuildForm(): void {
    this.profileForm = new FormGroup({
      id: new FormControl(),
      fullName: new FormControl(null, [Validators.required,]),
      cin: new FormControl(null, [Validators.required,]),
      birthDate: new FormControl(null, [Validators.required, ValidateForm.isBeforeToDay]),
      gender: new FormControl(null, [Validators.required]),
      birthPlace: new FormControl(),
      academicLevel: new FormControl(),
      email: new FormControl(null, [Validators.required, Validators.email, ValidateForm.isValidEmail]),
      phoneNumber: new FormControl(null, [Validators.required, ValidateForm.isValidPhone]),
      profession: new FormControl(),
      address: new FormControl(),
      country: new FormControl("Maroc"),
      city: new FormControl(),
      postalCode: new FormControl(),
      gps: new FormControl(),
      imageProfile: new FormControl(),
      note: new FormControl(),
    });

  }

  //Preview the chosen image
  PreviewUploadedImage(event: any, targetedImage: string): void {

    const file = event.target.files[0];
    var allowedFormat = ['jpg', 'bmp', 'png', 'jpeg'];

    if (!file) return; //if no file is been chosen return.

    var fileExtension = file.name.split('.').pop();

    //Check if the uploaded extension is allowed
    if (fileExtension && !allowedFormat.includes(fileExtension)) {
      alert("le type de fichier n'est pas une image valide.\n Seul ce type d'image est autorisé :\njpg, bmp, png, jpeg");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (targetedImage == "mainImage") {
        let imageBase64 = reader.result?.toString(); //base64 encoded image
        this.profileForm.get('imageProfile')?.setValue(imageBase64?.substring(imageBase64.indexOf('/') + 1)); //save image data to watcher
        this.previewImageMain.nativeElement.src = reader.result; //show image
        this.btnUploadMain.nativeElement.innerHTML = "Changer"; //change Text Button
        this.showBtnDeleteImgMain = true; //Show Delete Button
      }
    }

  }

  //Remove image
  RemoveUploadedImage(targetedImage: string): void {

    //for the main profile image.
    if (targetedImage == "mainImage") {
      this.profileForm.get('imageProfile')?.setValue(''); //delete image data (from watcher)
      this.previewImageMain.nativeElement.src = "../../../../../assets/img/profileUserIcon.png"; //clear src image
      this.btnUploadMain.nativeElement.innerHTML = "Choisir"; //change Text Button
      this.imageUploaderMain.nativeElement.value = ''; //reset input file.
      this.showBtnDeleteImgMain = false; //Hide delete Button
    }
  }

  //Get profile Data by Id
  GetProfileById(profileId: string): void {
    this.adminService.getEmployeeById(profileId).subscribe({
      next: (result: OrgMember) => {
        let employeeProfileData: OrgMember;
        employeeProfileData = result;
        console.log(employeeProfileData);

        if (employeeProfileData.id && employeeProfileData.id.length > 0) {
          this.title = "Modifier le profil";
          this.textBtn = "Modifier";
          this.showNotFound = false;

          //keep a copy of the Id
          this.profileId = employeeProfileData.id ? employeeProfileData.id : '';
          this.profileForm.patchValue(employeeProfileData);
          //Keep a copy of registrationDate
          this.registrationDate = employeeProfileData.registrationDate ? employeeProfileData.registrationDate : null;
          //Set date value
          let birthday = employeeProfileData.birthDate ? employeeProfileData.birthDate : '';

          if (birthday !== '') {
            this.profileForm.get('birthDate')?.patchValue(formatDate(birthday, 'yyyy-MM-dd', 'en'));
          }

          delete employeeProfileData.birthDate; //to execute pathValue() without errors.

          //show profile images if exist.
          let imgMain = employeeProfileData.imageProfile;

          this.previewImageMain.nativeElement.src = (imgMain && imgMain.length > 0) ? "data:image/" + employeeProfileData.imageProfile : "../../../../../assets/img/profileUserIcon.png";
          this.showBtnDeleteImgMain = (imgMain && imgMain.length > 0) ? true : false; //Show Delete Button

        }

      },
      error: (er: HttpErrorResponse) => {
        this.title = "Modifier le profil";
        this.showNotFound = true;
        this.toastr.error(er.error.description)
      },
    });

  }

  //Submit data to server to insert new profile or update an existing profile.
  UpsertData(): void {
    let EmployeeProfileData: OrgMember = { isEmployee: true, }
    // Verify the form is valid

    if (!this.profileForm.valid) return;

    // Get form Values.
    const dataToSubmit = this.profileForm.value;

    // map/merge
    EmployeeProfileData = { ...EmployeeProfileData, ...dataToSubmit };


    if (this.profileId == null) { //Insert New Profile

      delete EmployeeProfileData.id; // for new profile remove the Id property, the server will generate one. 

      //Send Data
      this.adminService.addEmployeeProfile(EmployeeProfileData).subscribe(
        {
          next: (result: any) => {
            //if succeed, the api will return saved data back from server.
            //show notification
            this.toastr.success("Profil enregistré avec succès.", '')
            //redirect to list
            setTimeout(() => { this.router.navigate([`dashboard/member/profile/${result.id}`]); }, 2);

          },
          error: (er: HttpErrorResponse) => {

            this.toastr.error(er.error.description);
          },

        }
      );
    }
    else { //Update

      //Get back the registration date.
      if (this.registrationDate) EmployeeProfileData.registrationDate = this.registrationDate;

      //set the role
      if (this.isChild) {
        console.log(`from child : ${this.isActive}`);
        EmployeeProfileData.isActive = this.isActive;
      }

      this.adminService.updateEmployeeById(dataToSubmit.id, EmployeeProfileData).subscribe({
        next: (result: any) => {
          // Show Notification of success
          this.toastr.success("profil modifié avec succès.", '',)

          if (this.isChild) {
            // Reload the page
            window.location.reload();
          } else {
            //redirect to Profile Detail Page
            setTimeout(() => { this.router.navigate([`member/profile/${dataToSubmit.id}`]); }, 0);
          }


        },
        error: (er: HttpErrorResponse) => {
          this.toastr.error(er.error.description, '',)

        },
      });
    }


  }
}
