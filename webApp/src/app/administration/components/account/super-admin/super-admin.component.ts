import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/administration/services/auth.service';
import ValidateForm from 'src/app/repository/Forms/validateform';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent {

  superAdminForm!:FormGroup;
  isSuperAdminExist :boolean = true;


  constructor(private fb : FormBuilder, private router : Router, private authService : AuthService, private toastr : ToastrService){}

  ngOnInit(){
    //Prevent accessing this page if user is already Logged in ->  redirect to Dashboard.
    if(this.authService.isLoggedIn() && !this.authService.isTokenExpired()){
      console.log("from road to dashboard");
      this.router.navigate(['/dashboard']);
    }
    // Prevent accessing to this page if there is already a user with role superAdmin.
    // yes  -> redirect to login Page.
    this.anySuperAdmin();

    this.buildSuperAdminForm();


  }


  buildSuperAdminForm(){
    this.superAdminForm = this.fb.group({
      email : [null, [Validators.required, ValidateForm.isValidEmail] ],
      superAdminKey : [null, [Validators.required]],
      password: [null, [Validators.required, ValidateForm.isValidPasssword] ]
    });
  }


  //Activate super Admin user.
  onActivate(){

    if(!this.superAdminForm.valid){
      //show notification and error messages
      ValidateForm.validateAllFields(this.superAdminForm);
      this.toastr.error("Vérifiez les champs",);
      return;
    }

    const email = this.superAdminForm.get('email')?.value;
    const superAdminKey = this.superAdminForm.get('superAdminKey')?.value;
    const password = this.superAdminForm.get('password')?.value;
    const credentials = `${superAdminKey}/${email}/${password}`;
    console.log(credentials);
    this.authService.activateSuperAdmin(credentials).subscribe({
      next:(result: {description:string}) => {
        //Show notification
        this.toastr.success(result.description);
        // redirect the user to the login page.
        this.router.navigate(['login']);
      },
      error:(er : HttpErrorResponse) => {
        //show notification
        this.toastr.error(er.error.description, "Échoué");

      }
    });
  }


  anySuperAdmin(){
    this.authService.anySuperAdmin().subscribe({
      next: () => {
        this.isSuperAdminExist = false;
      },
      error: () => {
        this.isSuperAdminExist = true;
        this.router.navigate(['/login']);

      }
    });
  }
}
