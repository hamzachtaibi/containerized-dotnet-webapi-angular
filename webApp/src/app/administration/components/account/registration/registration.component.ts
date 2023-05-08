import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/administration/services/auth.service';
import { JwtToken } from 'src/app/models/jwtTokenModel';
import { RegistrationCredential } from 'src/app/models/registrationModel';
import ValidateForm from 'src/app/repository/Forms/validateform';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  registrationForm! : FormGroup;

  constructor(private fb : FormBuilder, private toastr: ToastrService, private authService : AuthService, private router : Router) {}


  ngOnInit(){
    if(this.authService.isLoggedIn() && !this.authService.isTokenExpired()){
      console.log("from road to dashboard");
      this.router.navigate(['/dashboard']);
    }
    
    this.buildregistrationForm();
    
  }
   

  buildregistrationForm(){
    this.registrationForm = this.fb.group({
      email : [null, [Validators.required, Validators.email]],
      password : [null, [Validators.required, ValidateForm.isValidPasssword]],
      validationCode: [null, [Validators.required]]
    });
  }


  onRegister() :  void{
    //let userCredentials: RegistrationCredential = { email: '', password: '', validationCode: ''};
    
    if(!this.registrationForm.valid){
      //show notification and error messages
      ValidateForm.validateAllFields(this.registrationForm);
      this.toastr.error("Vérifiez les champs",);
      return;
    }

    console.log("try get values");
    // Get form Values.
    //const dataToSubmit = this.registrationForm.value;
    
    // map/merge
    //userCredentials = { ...userCredentials, ...dataToSubmit };
    console.log("print credentials");
    console.log(this.registrationForm.value);

    //*****Try to register*****

    this.authService.register(this.registrationForm.value).subscribe({
      next:(response:any) => {
        console.log("succeed");
        //Show notification
        this.toastr.success(response.description);
        // redirect the user to the login page.
        this.router.navigate(['login']);


      },
      error: (er) => {
        //show notification
        this.toastr.error(er.error.description, "Échoué");

      }
    });
    
  }

}
