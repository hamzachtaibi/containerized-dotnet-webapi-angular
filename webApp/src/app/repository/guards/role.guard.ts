import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/administration/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  userRole:string='';

  constructor(
    private authService : AuthService,
    private router : Router,
    private toastr : ToastrService,
    private jwtHelper : JwtHelperService
  ){
    // get the user's role from the authentication service
    this.userRole = this.authService.decodeToken().role!;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // get the expected roles from the route's data object
      const allowedRole = route.data['allowedRoles'] as string[];

      // check if the user's role is included in the expected roles
      if (this.userRole && allowedRole && allowedRole.includes(this.userRole)) {
        return true; // grant access to the route
      }
      // if the user's role is not included in the expected roles, redirect them to the login page
      this.toastr.warning("vous n'êtes pas autorisé à utiliser cette page.",);
      // setTimeout(()=>{
      //   this.authService.logOut();
      // }, 2);
      
      return false;
  }


  
}
