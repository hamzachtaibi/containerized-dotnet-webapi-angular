import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/administration/services/admin.service';
import { Needy } from 'src/app/models/needyModel';
import ValidateForm from 'src/app/repository/Forms/validateform';

@Component({
  selector: 'app-upsert-profile',
  templateUrl: './upsert-profile.component.html',
  styleUrls: ['./upsert-profile.component.css',]
})
export class UpsertProfileComponent {


  @ViewChild('RefpreviewImageMain') previewImageMain!: ElementRef;
  @ViewChild('RefimageLabelNameMain') imageLabelNameMain!: ElementRef;
  @ViewChild('RefimageUploaderMain') imageUploaderMain!: ElementRef;
  @ViewChild('RefbtnUploadMain') btnUploadMain!: ElementRef;
  showBtnDeleteImgMain: boolean = false;
  profileImageMain?: string | null;

  @ViewChild('RefImagePreviewAnony') previewImageAnony!: ElementRef;
  @ViewChild('RefImageLabelNameAnony') imageLabelNameAnony!: ElementRef;
  @ViewChild('RefimageUploaderAnony') imageUploaderAnony!: ElementRef;
  @ViewChild('RefbtnUploadAnony') btnUploadAnony!: ElementRef;
  showBtnDeleteImgAnony: boolean = false;
  profileImageAnony?: string | null;


  title: string = "Add new Profile";
  /*Not Found page*/
  showNotFound:boolean = false;
  showButton:boolean = true;
  bigTitle : string = "Sorry, an error has occured, Requested Profile not found!";
  indications="Could be removed";
  /*End Not Found page*/

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
    
    this.BuildForm();
    //if url has an Id --> updating a profile.
    if (this.profileId && this.profileId.length > 0) {
      this.GetProfileById(this.profileId); //Fill the Form / or show Not Found
    } else {
      this.textBtn = "Ajouter";
      this.showNotFound = false;
    }
  }




  /**********************************
 *  Methods
 **********************************/

  //Build Form
  BuildForm(): void {
    this.profileForm = new FormGroup({
      id: new FormControl(), //= Guid.NewGuid().ToString().Replace("-", "_");
      cin: new FormControl(), //= Guid.NewGuid().ToString("N").Replace("-", "_").Substring(0, 15);
      fullName: new FormControl(null, [Validators.required,]),
      birthDate: new FormControl(null, [Validators.required, ValidateForm.isBeforeToDay]),
      gender: new FormControl(null, [Validators.required]),
      birthPlace: new FormControl(),
      academicLevel: new FormControl(),
      email: new FormControl(null, ),
      phoneNumber: new FormControl(null, [Validators.required, ValidateForm.isValidPhone]),
      maritalStatus: new FormControl(null, [Validators.required]),
      profession: new FormControl(),
      address: new FormControl(),
      country: new FormControl("Maroc"),
      city: new FormControl(),
      postalCode: new FormControl(),
      gps: new FormControl(),
      dreamOf: new FormControl(),
      familyRecordNumber: new FormControl(),
      fatherId: new FormControl(),
      motherId: new FormControl(),
      grandFatherId: new FormControl(),
      grandMotherId: new FormControl(),
      mariedToId: new FormControl(),
      imageProfile: new FormControl(),
      imageBlurry: new FormControl(),
      note: new FormControl(),
      fullNameArabic: new FormControl(),
      birthPlaceArabic: new FormControl(),
      academicLevelArabic: new FormControl(),
      addressArabic: new FormControl(),
      countryArabic: new FormControl("المغرب"),
      cityArabic: new FormControl(),
      professionArabic: new FormControl(),
      dreamOfArabic: new FormControl(),
      familyRecordNumberArabic: new FormControl(),
      noteArabic: new FormControl(),
    });

  }

  //Preview the chosen image
  PreviewUploadedImage(event: any, targetedImage: string): void {

    const file = event.target.files[0];
    var allowedFormat = ['jpg', 'bmp', 'png', 'jpeg'];

    if (!file) return; //if no file is been chosen retun.

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
        this.imageLabelNameMain.nativeElement.innerHTML = file.name; //change label text
        this.btnUploadMain.nativeElement.innerHTML = "Changer"; //change Text Button
        this.showBtnDeleteImgMain = true; //Show Delete Button
      }

      if (targetedImage == "anonyImage") {
        let imageBase64 = reader.result?.toString(); //base64 encoded image
        this.profileForm.get('imageBlurry')?.setValue(imageBase64?.substring(imageBase64.indexOf('/') + 1)); //save image data to watcher
        this.previewImageAnony.nativeElement.src = reader.result; //show image
        this.imageLabelNameAnony.nativeElement.innerHTML = file.name; //change label text
        this.btnUploadAnony.nativeElement.innerHTML = "Changer"; //change Text Button
        this.showBtnDeleteImgAnony = true; //Show Delete Button
      }
    }

  }

  //Remove image
  RemoveUploadedImage(targetedImage: string): void {

    //for the main profile image.
    if (targetedImage == "mainImage") {
      this.profileForm.get('imageProfile')?.setValue(''); //delete image data (from watcher)
      this.previewImageMain.nativeElement.src = ""; //clear src image
      this.btnUploadMain.nativeElement.innerHTML = "Choisir"; //change Text Button
      this.imageLabelNameMain.nativeElement.innerHTML = "Photo de profil"; //change label text
      this.imageUploaderMain.nativeElement.value = ''; //reset input file.
      this.showBtnDeleteImgMain = false; //Hide delete Button
    }

    //for the anonymous profile image.
    if (targetedImage == "anonyImage") {
      this.profileForm.get('imageBlurry')?.setValue('');  //delete image data (from watcher)
      this.previewImageAnony.nativeElement.src = ""; //clear src image
      this.btnUploadAnony.nativeElement.innerHTML = "Choisir"; //change Text Button
      this.imageLabelNameAnony.nativeElement.innerHTML = "Image inconnue"; //change label text
      this.imageUploaderAnony.nativeElement.value = ''; //reset input file.
      this.showBtnDeleteImgAnony = false; //Hide delete Button
    }

  }

  //Get profile Data by Id
  GetProfileById(profileId: string) : void{
    this.adminService.getNeedyById(profileId).subscribe({
      next: (result: Needy) => {
        let needyProfileData: Needy;
        needyProfileData = result;
        console.log(needyProfileData);
        
        if (needyProfileData.id && needyProfileData.id.length > 0) {
          this.title = "Modifier le profil";
          this.textBtn = "Modifier";
          this.showNotFound = false;

          //keep a copy of the Id
          this.profileId = needyProfileData.id ? needyProfileData.id : '';
          this.profileForm.patchValue(needyProfileData);
          //Keep a copy of registrationDate
          this.registrationDate = needyProfileData.registrationDate ? needyProfileData.registrationDate : null;
          //Set date value
          let birthday = needyProfileData.birthDate ? needyProfileData.birthDate : '';
          console.log(birthday);
          if(birthday !=='' ){
            this.profileForm.get('birthDate')?.patchValue(formatDate(birthday, 'yyyy-MM-dd', 'en'));
          }
          
          delete needyProfileData.birthDate; //to execute pathValue() without errors.

          //show profile images if exist.
          let imgMain = needyProfileData.imageProfile;
          let imgAnony = needyProfileData.imageBlurry;

          this.previewImageMain.nativeElement.src = (imgMain && imgMain.length > 0) ? "data:image/" + needyProfileData.imageProfile : "";
          this.showBtnDeleteImgMain = (imgMain && imgMain.length > 0) ? true : false; //Show Delete Button

          this.previewImageAnony.nativeElement.src = (imgAnony && imgAnony.length > 0) ? "data:image/" + needyProfileData.imageBlurry : "";
          this.showBtnDeleteImgAnony = (imgAnony && imgAnony.length > 0) ? true : false; //Show Delete Button

        }

      },
      error: (er : HttpErrorResponse) => {
        this.title = "Modifier le profil";
        this.showNotFound = true;
        this.toastr.error(er.error.description)
      },
    });

  }

  //Submit data to server to insert new profile or update an existing profile.
  UpsertData(): void {
    let needyProfileData: Needy = {isActive: false,  isNeedy: true, }
    // Verify the form is valid
    if (!this.profileForm.valid) return;

    // Get form Values.
    const dataToSubmit = this.profileForm.value;

    // map/merge
    needyProfileData = { ...needyProfileData, ...dataToSubmit };
    console.log(needyProfileData);

    if (this.profileId == null) { //Insert New Profile

      delete needyProfileData.id; // for new profile remove the Id property, the server will generate one. 

      //if unmarried person make sure the ControlForm "marriedToId" is not provided.
      if (needyProfileData.maritalStatus != 'Marié(e)') needyProfileData.mariedToId = null;

      //Send Data
      this.adminService.addNeedyProfile(needyProfileData).subscribe(
        {
          next: (result: any) => {
            //if succeed, the api will return saved data back from server.
            //show notification
            this.toastr.success("Profile successfully registered.", '')
            //redirect to list
            setTimeout(() => { this.router.navigate(['dashboar/profileList']); }, 0);

          },
          error: (er : HttpErrorResponse) => {
            console.log();
            this.toastr.error(er.error.description);
          },

        }
      );
    }
    else { //Update

      //Get back the registration date.
      if(this.registrationDate) needyProfileData.registrationDate = this.registrationDate;

      console.log(needyProfileData);
      
      this.adminService.updateNeedyById(dataToSubmit.id, needyProfileData).subscribe({
        next: (result: any) => {
          // Show Notification of success
          this.toastr.success("profil modifié avec succès.", '',)

          //redirect to Profile Detail Page
          setTimeout(() => { this.router.navigate([`dashboard/profileDetails/${dataToSubmit.id}`]); }, 0);

        },
        error: (er : HttpErrorResponse) => {
          this.toastr.error(er.error.description, '',)

        },
      });
    }


  }







}
