import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/administration/services/auth.service';
import { JwtToken } from 'src/app/models/jwtTokenModel';
import ValidateForm from 'src/app/repository/Forms/validateform';
import { __values } from 'tslib';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm! : FormGroup;

  constructor(private fb : FormBuilder, private toastr: ToastrService, private authService : AuthService, private router : Router) {}


  ngOnInit(){
    if(this.authService.isLoggedIn() && !this.authService.isTokenExpired()){
      this.router.navigate(['/dashboard']);
    }
    this.buildLoginForm();
    
  }
   


  buildLoginForm(){

    this.loginForm = this.fb.group({
      email : ["", [Validators.required, Validators.email]],
      password : ["", [Validators.required]],
      rememberme: [false]
    });
  }


  onLogin(){
    
    if(!this.loginForm.valid){
      //show notification and error messages
      ValidateForm.validateAllFields(this.loginForm);
      this.toastr.error("Verify the fields",);
      return;
    }

    //*****Try to Authenticate*****

    //send data to server
    this.authService.login(this.loginForm.value).subscribe({
      next: (response : JwtToken) => {
        //save the Token
        this.authService.setToken(response.access_token);
        console.log(response);
        //show notifcation
        this.toastr.success(response.description, "Connexion réussie");
        // redirect the user to the page they were trying to access, 
        this.router.navigateByUrl(this.authService.redirectUrl || '/');

        //Reload page
        //window.location.reload();
      },
      error: (er) =>{
        //Show notificaion
        this.toastr.error(er.error.description, "Échoué");
      }
      });
  }

}
