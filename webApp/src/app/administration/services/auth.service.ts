import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { changePasswordModel } from 'src/app/models/changePasswordModel';
import { JwtToken } from 'src/app/models/jwtTokenModel';
import { LoginCredentials } from 'src/app/models/loginModel';
import { OrgMember } from 'src/app/models/orgMemberModel';
import { PayLoadTokenModel } from 'src/app/models/payLoadTokenModel';
import { RegistrationCredential } from 'src/app/models/registrationModel';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl!:string; //will store the url page and used later to redirect the user to the original page they were trying to access,
  payLoadToken!:PayLoadTokenModel;

  constructor(
    private httpClient : HttpClient,
    private router : Router,
    private jwtHelper : JwtHelperService
  ) { }


  anySuperAdmin() : Observable<{isExist : boolean}>{
    return this.httpClient.get<{isExist:boolean}>(environment.ApiSuperAdminExist);
  }

  activateSuperAdmin(superAdminCredential : string) : Observable<{description : string}>{
    return this.httpClient.post<{description : string}>(environment.ApiActivateSuperAdmin+superAdminCredential, '');
  }

  register(registerUserCredentials : RegistrationCredential) : Observable<{description : string}>{
    return this.httpClient.post<{description : string}>(environment.ApiRegisterUser, registerUserCredentials)
  }

  login(LoginUserCredentials : LoginCredentials) : Observable<JwtToken>{
    return this.httpClient.post<JwtToken>(environment.ApiLogin, LoginUserCredentials);
  }

  changePassword(requestCredentials : changePasswordModel) : Observable<{description : string}>{
    return this.httpClient.post<{description:string}>(environment.ApiChangePassword, requestCredentials);
  }

  setToken(token : string) : void{
    localStorage.setItem("kfl_at", token);
  }

  getToken() : string | null{
    var strToken = localStorage.getItem("kfl_at");
    return strToken;
  }

  decodeToken() : PayLoadTokenModel{
    const token = this.getToken();
    if(token != null){
      this.payLoadToken = { ...this.payLoadToken, ...this.jwtHelper.decodeToken(token) };
    }
    return this.payLoadToken;
  }

  isLoggedIn() : boolean{
    return !!this.getToken();
  }

  isTokenExpired() : boolean{
    if(this.getToken() != null){
      return this.jwtHelper.isTokenExpired(this.getToken());
    }
    return false;
  }
  
  logOut() : void{
    //clear stored token
    if( this.getToken() != null )
      localStorage.removeItem("kfl_at");
      this.payLoadToken = {};
    
    this.router.navigate(["/login"]);
    //Reload page
    window.location.reload();
  }
}
