import { Component } from '@angular/core';
import { AuthService } from 'src/app/administration/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  //isValidAuthentication!:boolean;

  constructor(){ }

  ngOnInit(){
    //this.isValidAuthentication = this.validateAuthentication();
  }
  
  // validateAuthentication():boolean{
  //   if(this.authService.isLoggedIn() && !this.authService.isTokenExpired()){
  //     return true;
  //   }
  
  //   return false;
  // }
  

}
