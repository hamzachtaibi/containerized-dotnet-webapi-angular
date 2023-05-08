import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/administration/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private authService : AuthService,
    private router : Router,
    private toastr : ToastrService,
    private jwtHelper : JwtHelperService
  ){}

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if(this.authService.isLoggedIn() && !this.authService.isTokenExpired()){
      //if user is Logged in && token is not expired
      return true;
    }else{
      this.authService.redirectUrl = state.url; //get the url page that the user trying to access.
      this.toastr.info('Please login',);
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
